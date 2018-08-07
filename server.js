const express = require('express');
const cors = require('cors')
const app = express();
const routes = express.Router();
const bodyParser = require('body-parser');
const api = require('./server/controllers/apis');
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors());

//routes
app.post('/api/login', api.login);
app.get('/api/results/:username', api.results);
app.post('/api/results/alias', api.alias);
app.listen(port, () => console.log(`Listening on port ${port}`));