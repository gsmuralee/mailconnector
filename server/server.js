const express = require('express');
const cors = require('cors')
const app = express();
const routes = express.Router();
const bodyParser = require('body-parser');
const api = require('./controllers/apis');
const port = process.env.PORT || 9085;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors())
//routes
app.post('/api/login', cors(), api.login);
app.get('/api/reports/:username', cors(), api.reports);
app.post('/api/reports/alias', cors(),api.alias);
app.post('/api/reports/schedule', cors(),api.createSchedule);
app.put('/api/reports/schedule', cors(),api.updateSchedule);
app.delete('/api/reports/schedule/:id', cors(),api.deleteSchedule);
app.get('/api/alias/schedule/:cuid', cors(),api.getSchedule);
app.listen(port, () => console.log(`Listening on port ${port}`));