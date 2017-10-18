const rp = require('request-promise');
const os = require('os');

const notify = (makerKey) => (title, body, sender) => {
    if (!makerKey) {
        return new Promise((resolve, reject) => reject("maker key is mandatory"));
    }

    return rp({
        method: 'POST',
        uri: `https://maker.ifttt.com/trigger/ios_notification/with/key/${makerKey}`,
        json: true,
        body: {
            value1: sender || os.hostname(),
            value2: title,
            value3: body,
        }
    });
};

module.exports = (makerKey) => ({
    notify: notify(makerKey),
});
