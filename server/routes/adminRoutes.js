const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "IHS_ADMIN_2025";

const authAdmin = (req, res, next) => {
  const token = req.headers['x-admin-key'];
  if (token !== ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  next();
};

// Initialize or Reset Bracket with 8 Teams
router.post('/init-bracket', authAdmin, async (req, res) => {
  try {
    await Match.deleteMany({});
    const teams = await Team.find().sort({ seed: 1 }).limit(8);

    const matchTemplates = [
      // UPPER BRACKET ROUND 1 (Quarter Finals - Bo3)
      { matchCode: 'UB-R1-M1', bracket: 'UPPER', round: 1, matchNumber: 1, bestOf: 3, teamA: teams[0]?._id, teamB: teams[7]?._id, nextWinnerMatch: 'UB-R2-M1', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R1-M1', nextLoserSlot: 'teamA' },
      { matchCode: 'UB-R1-M2', bracket: 'UPPER', round: 1, matchNumber: 2, bestOf: 3, teamA: teams[3]?._id, teamB: teams[4]?._id, nextWinnerMatch: 'UB-R2-M1', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R1-M1', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R1-M3', bracket: 'UPPER', round: 1, matchNumber: 3, bestOf: 3, teamA: teams[1]?._id, teamB: teams[6]?._id, nextWinnerMatch: 'UB-R2-M2', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R1-M2', nextLoserSlot: 'teamA' },
      { matchCode: 'UB-R1-M4', bracket: 'UPPER', round: 1, matchNumber: 4, bestOf: 3, teamA: teams[2]?._id, teamB: teams[5]?._id, nextWinnerMatch: 'UB-R2-M2', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R1-M2', nextLoserSlot: 'teamB' },

      // UPPER BRACKET ROUND 2 (Semi Finals - Bo3)
      { matchCode: 'UB-R2-M1', bracket: 'UPPER', round: 2, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'UB-FINALS', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R2-M2', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R2-M2', bracket: 'UPPER', round: 2, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'UB-FINALS', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R2-M1', nextLoserSlot: 'teamB' },

      // UPPER BRACKET FINALS (Bo3)
      { matchCode: 'UB-FINALS', bracket: 'UPPER', round: 3, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'GRAND-FINALS', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-FINALS', nextLoserSlot: 'teamB' },

      // LOWER BRACKET ROUND 1 (Bo3)
      { matchCode: 'LB-R1-M1', bracket: 'LOWER', round: 1, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-R2-M1', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R1-M2', bracket: 'LOWER', round: 1, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'LB-R2-M2', nextWinnerSlot: 'teamA' },

      // LOWER BRACKET ROUND 2 (Quarter Finals - Bo3)
      { matchCode: 'LB-R2-M1', bracket: 'LOWER', round: 2, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-R3-M1', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R2-M2', bracket: 'LOWER', round: 2, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'LB-R3-M1', nextWinnerSlot: 'teamB' },

      // LOWER BRACKET ROUND 3 (Semi Finals - Bo3)
      { matchCode: 'LB-R3-M1', bracket: 'LOWER', round: 3, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-FINALS', nextWinnerSlot: 'teamA' },

      // LOWER BRACKET FINALS (Bo3)
      { matchCode: 'LB-FINALS', bracket: 'LOWER', round: 4, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'GRAND-FINALS', nextWinnerSlot: 'teamB' },

      // GRAND FINALS (Bo5: Team A = UB Winner with 0 losses, Team B = LB Winner with 1 loss)
      { matchCode: 'GRAND-FINALS', bracket: 'GRAND_FINALS', round: 5, matchNumber: 1, bestOf: 5 },

      // BRACKET RESET (Bo5: Triggered ONLY if LB Winner beats UB Winner in Grand Finals)
      { matchCode: 'GF-RESET', bracket: 'GRAND_FINALS', round: 6, matchNumber: 2, bestOf: 5, status: 'PENDING' }
    ];

    await Match.insertMany(matchTemplates);
    res.json({ message: "Double Elimination Bracket created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Score & Automatic Progression
router.put('/update-score/:matchCode', authAdmin, async (req, res) => {
  try {
    const { matchCode } = req.params;
    const { scoreA, scoreB } = req.body;

    const match = await Match.findOne({ matchCode });
    if (!match) return res.status(404).json({ error: "Match not found" });
    if (!match.teamA || !match.teamB) {
      return res.status(400).json({ error: "Cannot submit scores. Both teams must be set first." });
    }

    match.scoreA = Number(scoreA);
    match.scoreB = Number(scoreB);

    // Bo3 = 2 wins, Bo5 = 3 wins
    const winCondition = Math.ceil(match.bestOf / 2);

    if (match.scoreA >= winCondition || match.scoreB >= winCondition) {
      match.status = 'COMPLETED';
      const winnerId = match.scoreA >= winCondition ? match.teamA : match.teamB;
      const loserId = match.scoreA >= winCondition ? match.teamB : match.teamA;

      match.winner = winnerId;
      match.loser = loserId;
      await match.save();

      // Special Case: Grand Finals 1 Logic (True Double Elimination)
      if (matchCode === 'GRAND-FINALS') {
        const isLowerBracketWinnerVictory = String(winnerId) === String(match.teamB);

        if (isLowerBracketWinnerVictory) {
          // LB Winner defeated UB Winner -> Bracket Reset Triggered!
          await Match.findOneAndUpdate(
            { matchCode: 'GF-RESET' },
            {
              teamA: match.teamA, // UB Winner (now 1 loss)
              teamB: match.teamB, // LB Winner (1 loss)
              status: 'ONGOING',
              scoreA: 0,
              scoreB: 0
            }
          );
        } else {
          // UB Winner won -> Tournament Champion (No Reset required)
          await Match.findOneAndUpdate(
            { matchCode: 'GF-RESET' },
            { status: 'COMPLETED', scoreA: 0, scoreB: 0 }
          );
        }
      }

      // Normal Progression for Standard Matches
      if (match.nextWinnerMatch && match.nextWinnerSlot) {
        await Match.findOneAndUpdate(
          { matchCode: match.nextWinnerMatch },
          { [match.nextWinnerSlot]: winnerId, status: 'ONGOING' }
        );
      }

      if (match.nextLoserMatch && match.nextLoserSlot) {
        await Match.findOneAndUpdate(
          { matchCode: match.nextLoserMatch },
          { [match.nextLoserSlot]: loserId, status: 'ONGOING' }
        );
      }
    } else {
      match.status = 'ONGOING';
      await match.save();
    }

    res.json({ message: "Match score updated and bracket progressed.", match });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;