const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors({origin: true}))
   .use(bodyParser.json())
   .use(require("./check_id_token.js"))
   .use("/map", require("./model/map"))
   .get('*', (_, response) => {
       response.status(404).json({success: false, data: "Endpoint is not valid"});
   });

module.exports = app;
