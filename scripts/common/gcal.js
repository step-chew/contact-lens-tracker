'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const rp = require('request-promise');

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const RFC3339_DATE_FORMAT = 'YYYY-MM-DD\\THH:mm:ss\\Z';
const root = process.cwd();
const calendarId = process.env.GOOGLE_CALENDER_ID;

const getJwt = () => jwt.sign(
    {
        iss: process.env.GOOGLE_ISSUER,
        scope: "https://www.googleapis.com/auth/calendar",
        aud: "https://www.googleapis.com/oauth2/v4/token",
    },
    fs.readFileSync(`${root}/resources/google.private.key`),
    {
        algorithm: 'RS256',
        expiresIn: '1h',
    }
);

const authenticate = () =>
    rp({
        method: 'POST',
        uri: 'https://www.googleapis.com/oauth2/v4/token',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: getJwt(),
        },
        transform: body => JSON.parse(body),
    });

const newEvent = (accessToken, title) => {
    const today = moment();
    return rp({
        method: 'POST',
        uri: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        qs: {
            access_token: accessToken,
        },
        json: true,
        body: {
            summary: title,
            start: {
                date: today.format(ISO_DATE_FORMAT),
            },
            end: {
                // to create a full day event, end date must equal to start date + 1,
                // else yielding perculiar response when trying to get
                date: today.add(1, 'days').format(ISO_DATE_FORMAT),
            }
        },
    })
}

const listRecentEvents = (accessToken) => {
    const calendarId = 'chew.es_tl2c6lkpgv0ijugm94vrf72a20@group.calendar.google.com';
    const today = moment();
    const sixMonthsAgo = today.subtract(6, 'months');
    return rp({
        method: 'GET',
        uri: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        qs: {
            access_token: accessToken,
            singleEvents: true,
            orderBy: "startTime",
            timeMin: sixMonthsAgo.format(RFC3339_DATE_FORMAT),
        },
        transform: body => JSON.parse(body),
    });
};

const updateEvent = (accessToken, eventId) => {
    const today = moment();
    return rp({
        method: 'PATCH',
        uri: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        qs: {
            access_token: accessToken,
        },
        json: true,
        body: {
            end: {
                // to create a full day event, end date must equal to start date + 1,
                // else yielding perculiar response when trying to get
                date: today.add(1, 'days').format(ISO_DATE_FORMAT),
            }
        },
    })
};

exports.getJwt = getJwt;
exports.authenticate = authenticate;
exports.newEvent = newEvent;
exports.listRecentEvents = listRecentEvents;
exports.updateEvent = updateEvent;
