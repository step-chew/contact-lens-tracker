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
    console.log(req);
    next();
  }
});

router.get('/', (req, res) => {
  res.send('Status called!');
});

router.post('/', (req, res) => {
  res.send('Toggle called!');
});

router.post('/new', (req, res) => {
  res.send('New called!');
});

router.post('/dispose', (req, res) => {
  res.send('Dispose called!');
});

module.exports = router;