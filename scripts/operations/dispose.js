'use strict';

const gcal = require('../common/gcal');
const eventStatus = require('./status');
const ifttt = require('../common/ifttt')(process.env.IFTTT_MAKER);

module.exports = eventId =>
    (eventId ? new Promise(resolve => resolve({event: {id: eventId}})) : eventStatus.getLastEventWithStatus())
        .then(({event: {id: evtId}} = {event: {}}) =>
            // evtId is undefined if there is no previous event
            !evtId
                ? ifttt.notify('AWS', 'Error', 'No contact lens event found')
                : gcal.authenticate()
                    .then(resp => gcal.updateEvent(resp.access_token, evtId))
                    .then(() => ifttt.notify('AWS', 'Contact Lens Disposed'))
        )
