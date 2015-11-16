var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var traceEvent = new Schema({
  sessionId: String,
  origin: String,
  destination: String,
  time: Date
});

var TraceEvent = mongoose.model('TraceEvent', traceEvent);

module.exports = TraceEvent;