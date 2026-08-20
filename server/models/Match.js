const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchCode: { type: String, required: true, unique: true },
  bracket: { type: String, enum: ['UPPER', 'LOWER', 'GRAND_FINALS'], required: true },
  round: { type: Number, required: true },
  matchNumber: { type: Number, required: true },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  bestOf: { type: Number, default: 3 },
  status: { type: String, enum: ['PENDING', 'ONGOING', 'COMPLETED'], default: 'PENDING' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  loser: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  nextWinnerMatch: { type: String, default: null },
  nextWinnerSlot: { type: String, enum: ['teamA', 'teamB'], default: null },
  nextLoserMatch: { type: String, default: null },
  nextLoserSlot: { type: String, enum: ['teamA', 'teamB'], default: null }
});

module.exports = mongoose.model('Match', matchSchema);