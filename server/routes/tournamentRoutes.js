const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Match = require('../models/Match');
const TournamentState = require('../models/TournamentState');

const ensureBracketExists = async () => {
  const matchCount = await Match.countDocuments();
  if (matchCount === 0) {
    const matchTemplates = [
      { matchCode: 'UB-R1-M1', bracket: 'UPPER', round: 1, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'UB-R2-M1', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R1-M1', nextLoserSlot: 'teamA' },
      { matchCode: 'UB-R1-M2', bracket: 'UPPER', round: 1, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'UB-R2-M1', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R1-M1', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R1-M3', bracket: 'UPPER', round: 1, matchNumber: 3, bestOf: 3, nextWinnerMatch: 'UB-R2-M2', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R1-M2', nextLoserSlot: 'teamA' },
      { matchCode: 'UB-R1-M4', bracket: 'UPPER', round: 1, matchNumber: 4, bestOf: 3, nextWinnerMatch: 'UB-R2-M2', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R1-M2', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R2-M1', bracket: 'UPPER', round: 2, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'UB-FINALS', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-R2-M2', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-R2-M2', bracket: 'UPPER', round: 2, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'UB-FINALS', nextWinnerSlot: 'teamB', nextLoserMatch: 'LB-R2-M1', nextLoserSlot: 'teamB' },
      { matchCode: 'UB-FINALS', bracket: 'UPPER', round: 3, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'GRAND-FINALS', nextWinnerSlot: 'teamA', nextLoserMatch: 'LB-FINALS', nextLoserSlot: 'teamB' },
      { matchCode: 'LB-R1-M1', bracket: 'LOWER', round: 1, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-R2-M1', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R1-M2', bracket: 'LOWER', round: 1, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'LB-R2-M2', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R2-M1', bracket: 'LOWER', round: 2, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-R3-M1', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-R2-M2', bracket: 'LOWER', round: 2, matchNumber: 2, bestOf: 3, nextWinnerMatch: 'LB-R3-M1', nextWinnerSlot: 'teamB' },
      { matchCode: 'LB-R3-M1', bracket: 'LOWER', round: 3, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'LB-FINALS', nextWinnerSlot: 'teamA' },
      { matchCode: 'LB-FINALS', bracket: 'LOWER', round: 4, matchNumber: 1, bestOf: 3, nextWinnerMatch: 'GRAND-FINALS', nextWinnerSlot: 'teamB' },
      { matchCode: 'GRAND-FINALS', bracket: 'GRAND_FINALS', round: 5, matchNumber: 1, bestOf: 5 },
      { matchCode: 'GF-RESET', bracket: 'GRAND_FINALS', round: 6, matchNumber: 2, bestOf: 5, status: 'PENDING' }
    ];
    await Match.insertMany(matchTemplates);
  }
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

// Helper to broadcast full state via Socket.io
const broadcastBracketUpdate = async (io) => {
  const matches = await Match.find()
    .populate('teamA')
    .populate('teamB')
    .populate('winner')
    .populate('loser')
    .sort({ matchCode: 1 });
  const teams = await Team.find().sort({ seed: 1 });
  const state = await TournamentState.findOne();

  io.emit('bracketUpdated', { matches, teams, state });
};

// Register Team with instant WebSocket broadcast
router.post('/register-team', async (req, res) => {
  try {
    await ensureBracketExists();

    const { name, tag, expLane, core, midLane, goldLane, roam, sixthMan } = req.body;
    const count = await Team.countDocuments();
    if (count >= 8) {
      return res.status(400).json({ error: "Tournament is full (8/8 Teams registered)." });
    }

    const newTeam = new Team({
      name,
      tag,
      seed: count + 1,
      players: { expLane, core, midLane, goldLane, roam, sixthMan }
    });
    await newTeam.save();

    const targetSlot = slotMap[count];
    if (targetSlot) {
      await Match.findOneAndUpdate(
        { matchCode: targetSlot.matchCode },
        { [targetSlot.slot]: newTeam._id, status: 'ONGOING' }
      );
    }

    // Start 5-minute timer if 8th team registers
    if (count + 1 === 8) {
      let state = await TournamentState.findOne();
      if (!state) state = new TournamentState();
      state.timerStartedAt = new Date();
      state.isShuffled = false;
      await state.save();
    }

    // BROADCAST INSTANTLY TO ALL CONNECTED USERS
    const io = req.app.get('io');
    await broadcastBracketUpdate(io);

    res.status(201).json({ message: "Team registered successfully!", team: newTeam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Bracket Data
router.get('/bracket', async (req, res) => {
  try {
    await ensureBracketExists();

    let state = await TournamentState.findOne();
    if (!state) state = await TournamentState.create({});

    const teams = await Team.find().sort({ seed: 1 });

    // Check timer expiration & auto-shuffle
    if (teams.length === 8 && state.timerStartedAt && !state.isShuffled) {
      const elapsedSeconds = (Date.now() - new Date(state.timerStartedAt).getTime()) / 1000;
      if (elapsedSeconds >= state.countdownDurationSeconds) {
        const randomizedTeams = shuffleArray(teams);

        for (let i = 0; i < 8; i++) {
          const mapping = slotMap[i];
          await Match.findOneAndUpdate(
            { matchCode: mapping.matchCode },
            { [mapping.slot]: randomizedTeams[i]._id, status: 'ONGOING' }
          );
        }

        state.isShuffled = true;
        await state.save();

        const io = req.app.get('io');
        await broadcastBracketUpdate(io);
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