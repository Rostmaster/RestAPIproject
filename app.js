const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');

const app = express();

app.use(bodyParser.json());


app.use(cors());


app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});