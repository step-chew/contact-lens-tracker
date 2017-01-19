const rp = require('request-promise');

const notify = (makerKey) => (sender, title, body) => {
    if (!makerKey) {
        return new Promise((resolve, reject) => reject("maker key is mandatory"));
    }

    return rp({
        method: 'POST',
        uri: `https://maker.ifttt.com/trigger/ios_notification/with/key/${makerKey}`,
        json: true,
        body: {
            value1: sender,
            value2: title,
            value3: body,
        }
    });
};

module.exports = (makerKey) => ({
    notify: notify(makerKey),
});
