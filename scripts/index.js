const createEvent = require('./operations/create');
const eventStatus = require('./operations/status');
const toggleEvent = require('./operations/toggle');
const updateDisposeEvent = require('./operations/dispose');

const createResponse = (callback) => (status, body) => {
    const resp = {
        statusCode: status.toString(),
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
    callback(null, resp);
    return resp;
};

const handleError = (response, error) => {
    if (error.statusCode !== undefined) {
        response(error.statusCode, {message: error.error});
    } else {
        response(500, {
            message: error.message,
            details: JSON.stringify(error, null, 2),
        });
    }
};

exports.handler = (event, context, callback) => {
    const response = createResponse(callback);

    // This is a mickey mouse auth, for a more appropriate authentication & authorisation, use AWS IAM.
    if (!event.queryStringParameters
            || event.queryStringParameters.api_key !== process.env.API_KEY) {
        response(403, {
            message: 'Forbidden',
        });
        return;
    }

    switch (event.httpMethod) {
        case 'GET':
            eventStatus()
                .then(() => response(200, {success: "ok"}))
                .catch(err => handleError(response, err));
            break;
        case 'POST':
            switch (event.pathParameters.action) {
                case 'new':
                    createEvent(event.queryStringParameters.geo)
                        .then(() => response(200, {success: "ok"}))
                        .catch(err => handleError(response, err));
                    break;
                case 'dispose':
                    updateDisposeEvent()
                        .then(() => response(200, {success: "ok"}))
                        .catch(err => handleError(response, err));
                    break;
                default:
                    toggleEvent()
                        .then(() => response(200, {success: "ok"}))
                        .catch(err => handleError(response, err));
                    break;
            }
            break;
        default:
            response(406, {
                message: 'Method not allowed',
            });
            break;
    }
};
