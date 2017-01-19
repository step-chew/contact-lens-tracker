'use strict';

const gcal = require('../common/gcal');
const ifttt = require('../common/ifttt')(process.env.IFTTT_MAKER);

module.exports = (response) =>
    gcal.authenticate()
        .then(resp =>
            gcal.newEvent(resp.access_token, 'New Contact Lens')
        )
        .then(() => ifttt.notify('AWS', 'New Contact Lens'))
