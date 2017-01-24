const gcal = require('../common/gcal');
const ifttt = require('../common/ifttt')(process.env.IFTTT_MAKER);
const moment = require('moment');

/**
 * @param startStr Start date in ISO format (e.g. 2016-12-31)
 * @param endStr End date in ISO format (e.g. 2016-12-31)
 */
const getContext = (startStr, endStr) => {
    const start = moment(startStr);
    // end date is always a day later if it's a full day event in GCal.
    const end = moment(endStr).subtract(1, 'days');
    const duration = end.diff(start, 'days');

    return {
        start,
        end,
        duration,
        // if 'start' & 'end' is the same day, means it's just started.
        started: duration <= 0,
    };
};

/**
 * Calculate the estimated expiry date based on a pre-defined logic (
 * with the assumption that it should end on a Friday).
 * @param startStr Start date in ISO format (e.g. 2016-12-31)
 * @return A moment.js date indicating the expiry date
 */
const getExpiryDate = (startStr) => {
    const FRIDAY = 5; // in moment.js, Friday == 5
    const THURSDAY = FRIDAY - 1; // in moment.js, Thursday == 4

    const start = moment(startStr);
    const startDay = start.day();

    // if start day is on or after Thursday
    const daysToAdd = ((startDay >= THURSDAY) ? 14 : 7) + (FRIDAY - startDay);

    return start.add(daysToAdd, 'days');
}

/**
 * @param context {Context} object obtained from getContext() function.
 */
const renderMessage = (context) => {
    if (context.started) {
        const daysFromStart = moment().diff(context.start, 'days');
        switch (daysFromStart) {
            case 0:
                return `You've just started your lens today!`;
            default:
                return `You're ${daysFromStart + 1} days into your new lens.`;
        }
    } else {
        const daysFromEnd = moment().diff(context.end, 'days');
        switch (daysFromEnd) {
            case 0:
                return `You've just disposed your lens today!`;
            case 1:
                return `You've disposed your lens a day ago.`;
            default:
                return `You've disposed your lens ${daysFromEnd} days ago, time for a new one.`;
        }
    }
};

const getLastEventWithStatus = () => {
    return gcal.authenticate()
        .then(resp => gcal.listRecentEvents(resp.access_token))
        .then((events) => {
            if (events.items.length <= 0) {
                return undefined;
            }

            const last = events.items[events.items.length - 1];

            const context = getContext(last.start.date, last.end.date);

            const message = renderMessage(context);

            return {
                event: {
                    id: last.id,
                    created: last.created,
                    updated: last.updated,
                    summary: last.summary,
                    start: last.start.date,
                    end: last.end.date,
                },
                message,
                context,
            };
        });
}

exports = module.exports = () =>
    getLastEventWithStatus()
        .then((eventWithStatus) => {
            if (!eventWithStatus) {
                return ifttt.notify('AWS', 'No Lens Record');
            }

            return ifttt.notify('AWS', 'Contact Lens Status', eventWithStatus.message);
        })

exports.getLastEventWithStatus = getLastEventWithStatus;

// expose for unit test
exports.getContext = getContext;

// expose for unit test
exports.renderMessage = renderMessage;

// expose for unit test
exports.getExpiryDate = getExpiryDate;
