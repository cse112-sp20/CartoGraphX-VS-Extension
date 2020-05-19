const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors({origin: true}))
   .use(bodyParser.json())
   //.use(require("./check_id_token.js"))
   .use("/directory", require("./model/directory_tree/router"))
   .use("/map", require("./model/map/router"))
   .get('*', (_, response) => {
       response.status(404).json({success: false, data: "Endpoint is not valid"});
   });

module.exports = app;
