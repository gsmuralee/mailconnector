const express = require('express');
const cors = require('cors')
const app = express();
const routes = express.Router();
const api = require('./server/controllers/apis');
const port = process.env.PORT || 5000;

app.options('*', cors());

//routes
app.get('/api/login', api.login);

app.listen(port, () => console.log(`Listening on port ${port}`));