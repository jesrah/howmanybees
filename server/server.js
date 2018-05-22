const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

app.use('/', express.static(path.join(__dirname, '../public/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/crops', (req, res) => res.send('You need bees!'));

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
