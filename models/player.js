var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: String,
  iconId: String,
  lastUpdated: Date,
  wins: Number,
  champions: []
});

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;