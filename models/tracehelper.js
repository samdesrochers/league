var TraceEvent = require('../models/traceevent');

var TraceHelper = function TraceHelper(){

    // Members
    var lastPage = "none";

    var events = [];

    // Functions
    this.logAnonymousNavigation = function(d) {

        var traceEvent = new TraceEvent({
            origin:lastPage,
            destination:d,
            time:new Date().toISOString()
        });

        events.push(traceEvent);
        lastPage = d;

        if(events.length === 5) {
            saveEvents(events);
            events = [];
        }
    };
 
    if(TraceHelper.caller != TraceHelper.getInstance){
        throw new Error("This object cannot be instanciated");
    }
}
 
/*************************************************************************
TraceHelper 
**************************************************************************/
TraceHelper.instance = null;
 
TraceHelper.getInstance = function() {
    if(this.instance === null) {
        this.instance = new TraceHelper();
    }
    return this.instance;
}

module.exports = TraceHelper.getInstance();

function saveEvents(events) {
    for(var e in events) {
        var traceEvent = events[e];
        traceEvent.save(function (err, event) {
            if(err) { 
                console.error(err);
                return false;
            }

            console.log("[Event Logged] Navigation from " + traceEvent.origin + " to " + traceEvent.destination + " at " + traceEvent.time);
        });
    }
}