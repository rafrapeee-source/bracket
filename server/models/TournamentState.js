const mongoose = require('mongoose');

const tournamentStateSchema = new mongoose.Schema({
  timerStartedAt: { type: Date, default: null },
  isShuffled: { type: Boolean, default: false },
  countdownDurationSeconds: { type: Number, default: 300 } // 5 minutes = 300 seconds
});

module.exports = mongoose.model('TournamentState', tournamentStateSchema);