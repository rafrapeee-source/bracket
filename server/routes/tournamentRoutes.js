const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Match = require('../models/Match');

router.post('/register-team', async (req, res) => {
  try {
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
    res.status(201).json({ message: "Team registered successfully!", team: newTeam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bracket', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('teamA')
      .populate('teamB')
      .populate('winner')
      .populate('loser')
      .sort({ matchCode: 1 });
    const teams = await Team.find();
    res.json({ matches, teams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;