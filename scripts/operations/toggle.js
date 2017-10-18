const eventStatus = require('./status');
const createEvent = require('./create');
const updateDisposeEvent = require('./dispose');
const gcal = require('../common/gcal');
const ifttt = require('../common/ifttt')(process.env.IFTTT_MAKER);
const moment = require('moment');

module.exports = (geolocation) =>
    eventStatus.getLastEventWithStatus().then((status) => {
        const event = status.event;
        const context = status.context;
        const today = moment();

        // start date == today -> just started
        if (today.isSame(context.start, 'day')) {
            return ifttt.notify('No Action', `You've just started contact lens today!`);
        }
        else if (today.isSame(context.end, 'day')) { // start date != today && end date = today -> just ended
            return ifttt.notify('No Action', `You've just disposed contact lens today!`);
        }

        return (context.started) ? updateDisposeEvent(event.id) : createEvent(geolocation);
    });
;
