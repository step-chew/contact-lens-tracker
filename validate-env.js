const requiredVariables = [
    'API_KEY',
    'IFTTT_MAKER',
    'GOOGLE_ISSUER',
    'GOOGLE_CALENDER_ID',
];

const environmentVariables = Object.keys(process.env).map(env => env.toUpperCase());

module.exports = requiredVariables.filter((i) => environmentVariables.indexOf(i) < 0);
