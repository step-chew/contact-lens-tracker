if (process.argv.length < 3) {
    console.log("[Usage] node lambda.js METHOD")
    return;
}

const method = process.argv[2].toUpperCase();

const validMethods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'HEAD',
    'OPTIONS',
    'PATCH',
];

// validate HTTP methods
if (!validMethods.find(i => i === method)) {
    console.error(`Only [${validMethods.join(', ')}] are allowed. Found '${method}'`);
    return;
}

const missing = require('./validate-env');
if (missing && missing.length > 0) {
    console.error(`Environment variable(s) [${missing.join('; ')}] cannot be found.`);
    return;
}

const event = require('./resources/request.json');
event.httpMethod = method;
event.queryStringParameters = Object.assign({}, event.queryStringParameters, {
    'api_key': process.argv[3] || '',
});
event.pathParameters = Object.assign({}, event.pathParameters, {
    action: process.argv[4],
});

const context = {
    getRemainingTimeInMillis: () => 1,
    functionName: 'gcal',
    awsRequestId: '12345',
};

const callback = (error, response) => {
    console.log(`${response.statusCode} HTTP/1.1`);
    console.log(response.body);
};

require('./scripts/index.js').handler(event, context, callback);
