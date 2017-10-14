const express = require('express');
const bodyParser = require('body-parser');
const contactLensRoute = require('./routes/contact-lens.route');

const app = express();

const port = parseInt(process.argv[2], 10) || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use('/contact-lens', contactLensRoute);

app.listen(port, () => {
  console.log(`HTTP running at port ${port}`);
});