const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({});

const model_server = require('./src/model_server');

const api = functions.https.onRequest(model_server);


module.exports = {
    api:api
};
