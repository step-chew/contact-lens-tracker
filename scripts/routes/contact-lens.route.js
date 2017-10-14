const queryString = require('query-string');
const router = require('express').Router();
const index = require('../index');

router.use((req, res, next) => {
  if (req.query['api_key'] !== 'eb5494bd-e5cc-4d5f-9db8-078371f5ba41') {    
    res
      .status(401)
      .json({
        message: 'Forbidden'
      })
      .end();
  } else {
    next();
  }
});

const constructEventObject = req => ({
  httpMethod: req.method,
  queryStringParameters: req.query,
  body: queryString.stringify(req.body),
});

const response = (res) => (err, {statusCode, headers, body}) => {
  res
    .status(statusCode)
    .type(headers['Content-Type'])
    .json(JSON.parse(body));
};

router.get('/', (req, res) => {
  index.handler(constructEventObject(req), undefined, response(res));
});

router.post('/', (req, res) => {
  index.handler(constructEventObject(req), undefined, response(res));
});

router.post('/new', (req, res) => {
  index.handler({
      ...constructEventObject(req),
      pathParameters: 'new',
    },
    undefined,
    response(res)
  );
});

router.post('/dispose', (req, res) => {
  index.handler({
      ...constructEventObject(req),
      pathParameters: 'dispose',
    },
    undefined,
    response(res)
  );
});

module.exports = router;