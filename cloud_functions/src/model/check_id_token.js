const admin = require('firebase-admin');

function checkIDToken(request, response, next){
  let idToken = request.header('idToken');
  admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    let uid = decodedToken.uid;
    request.userID = uid;
    next();
  }).catch(function(error) {
    response.sendStatus(401);
  });
}


module.exports = checkIDToken;
