const admin = require('firebase-admin');

/**
* Checks that the ID token in the header of the request 
* that was sent is valid, gets the corresponding uid, and
* sends that information to the desired cloud function.
*
* @param  {XMLHttpRequest} request The request that was passed in
* @param  {function} next The cloud function that will be called after
*/
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
