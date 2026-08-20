const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Match = require('../models/Match');
const TournamentState = require('../models/TournamentState');

// Helper to ensure base bracket structure exists
const ensureBracketExists = async () => {
  const matchCount = await Match.countDocuments();
  if (matchCount === 0) {
    const matchTemplates = [
      // UPPER BRACKET
      { matchCode: 'UB-R1-M1', bracket: 'UPPER', round: 1, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'UB-R2-M1', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R1-M1', nextLoserSlot: 'teamA' },
      { matchCode: 'UB-R1-M2', bracket: 'UPPER', round: 1, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'UB-R2-M1', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R1-M1', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R1-M3', bracket: 'UPPER', round: 1, matchNumber: 3, bestOf: 3, nextWinnerMatch: 'UB-R2-M2', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R1-M2', nextLoserSlot: 'teamA' },
      { matchCode: 'UB-R1-M4', bracket: 'UPPER', round: 1, matchNumber: 4, bestOf: 3, nextWinnerMatch: 'UB-R2-M2', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R1-M2', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R2-M1', bracket: 'UPPER', round: 2, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'UB-FINALS', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R2-M2', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R2-M2', bracket: 'UPPER', round: 2, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'UB-FINALS', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R2-M1', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-FINALS', bracket: 'UPPER', round: 3, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'GRAND-FINALS', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-FINALS', nextLoserSlot: 'teamB' },

      // LOWER BRACKET
      { matchCode: 'LB-R1-M1', bracket: 'LOWER', round: 1, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-R2-M1', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R1-M2', bracket: 'LOWER', round: 1, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'LB-R2-M2', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R2-M1', bracket: 'LOWER', round: 2, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-R3-M1', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R2-M2', bracket: 'LOWER', round: 2, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'LB-R3-M1', nextWinnerSlot: 'teamB' },
      { matchCode: 'LB-R3-M1', bracket: 'LOWER', round: 3, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-FINALS', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-FINALS', bracket: 'LOWER', round: 4, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'GRAND-FINALS', nextWinnerSlot: 'teamB' },

      // GRAND FINALS & RESET (Bo5)
      { matchCode: 'GRAND-FINALS', bracket: 'GRAND_FINALS', round: 5, matchNumber: 1, bestOf: 5 },
      { matchCode: 'GF-RESET', bracket: 'GRAND_FINALS', round: 6, matchNumber: 2, bestOf: 5, status: 'PENDING' }
    ];
    await Match.insertMany(matchTemplates);
  }
};

// Helper: Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Map of slot numbers to match codes
const slotMap = [
  { matchCode: 'UB-R1-M1', slot: 'teamA' },
  { matchCode: 'UB-R1-M1', slot: 'teamB' },
  { matchCode: 'UB-R1-M2', slot: 'teamA' },
  { matchCode: 'UB-R1-M2', slot: 'teamB' },
  { matchCode: 'UB-R1-M3', slot: 'teamA' },
  { matchCode: 'UB-R1-M3', slot: 'teamB' },
  { matchCode: 'UB-R1-M4', slot: 'teamA' },
  { matchCode: 'UB-R1-M4', slot: 'teamB' }
];

// Register Team (Auto-assigns to next available bracket slot)
router.post('/register-team', async (req, res) => {
  try {
    await ensureBracketExists();

    const { name, tag, expLane, core, midLane, goldLane, roam, sixthMan } = req.body;
    const count = await Team.countDocuments();
    if (count >= 8) {
      return res.status(400).json({ error: "Tournament is already full (8/8 Teams registered)." });
    }

    const newTeam = new Team({
      name,
      tag,
      seed: count + 1,
      players: { expLane, core, midLane, goldLane, roam, sixthMan }
    });
    await newTeam.save();

    // Instantly put into current bracket slot
    const targetSlot = slotMap[count];
    if (targetSlot) {
      await Match.findOneAndUpdate(
        { matchCode: targetSlot.matchCode },
        { [targetSlot.slot]: newTeam._id, status: 'ONGOING' }
      );
    }

    // When 8th team registers -> Trigger 5-minute countdown!
    if (count + 1 === 8) {
      let state = await TournamentState.findOne();
      if (!state) {
        state = new TournamentState();
      }
      state.timerStartedAt = new Date();
      state.isShuffled = false;
      await state.save();
    }

    res.status(201).json({ message: "Team registered and placed on bracket!", team: newTeam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Bracket Data (With Auto-Shuffle when 5-min timer ends)
router.get('/bracket', async (req, res) => {
  try {
    await ensureBracketExists();

    let state = await TournamentState.findOne();
    if (!state) {
      state = await TournamentState.create({});
    }

    const teams = await Team.find().sort({ seed: 1 });

    // Check if 5-minute timer expired and shuffle is needed
    if (teams.length === 8 && state.timerStartedAt && !state.isShuffled) {
      const elapsedSeconds = (Date.now() - new Date(state.timerStartedAt).getTime()) / 1000;
      
      if (elapsedSeconds >= state.countdownDurationSeconds) {
        // Shuffle all 8 teams randomly
        const randomizedTeams = shuffleArray(teams);

        // Assign randomized teams into Round 1 matches
        for (let i = 0; i < 8; i++) {
          const mapping = slotMap[i];
          await Match.findOneAndUpdate(
            { matchCode: mapping.matchCode },
            { [mapping.slot]: randomizedTeams[i]._id, status: 'ONGOING' }
          );
        }

        state.isShuffled = true;
        await state.save();
      }
    }

    const matches = await Match.find()
      .populate('teamA')
      .populate('teamB')
      .populate('winner')
      .populate('loser')
      .sort({ matchCode: 1 });

    res.json({ matches, teams, state });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;