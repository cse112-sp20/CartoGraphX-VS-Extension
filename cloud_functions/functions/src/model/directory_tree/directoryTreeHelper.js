

module.exports = {

    /**
    * Retrieves data regarding teammap from the firebase database
    * @param    {JSON object} res The response that the data will be sent in
    */
    getItemsFromDatabase: (res,admin) => {
        let maps = [];
        let teammap = admin.database().ref('/team_maps');

        return teammap.on('value', (snapshot) => {
          snapshot.forEach((map) => {
            maps.push({
              id: map.key,
              directory: map.val().directory,
              github_token_id: map.val().github_token_id,
              users: map.val().users
            });
          });   
          res.status(200).json(maps);
        }, (error) => {
          res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
          });
        });
      },
    
      /**
      * Returns the teammap that was just added in a JSON object
      * 
      * @param  {JSON object} res The teammap that was just added
      */
      getAddedTeamMap: (res) => {
        return teammap.on('child_added', (snapshot) => {
          res.status(200).json(snapshot.val());
        }, (error) => {
          res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
          });
        });
      },

      /**
      * Deletes a specified teammap based on the id passed in
      *
      * @param  {string} id The id of the teammap to be deleted
      */
      deleteTeammap: (id,admin) => {
        let directoryID;
        let teammapLoc = admin.database().ref(`/team_maps/${id}`);
        teammapLoc.once('value', (snapshot) => {
          directoryID = snapshot.val().directory;
          let directoryLoc = admin.database().ref(`/directory_trees/${directoryID}`);
  
          admin.database().ref(directoryLoc).remove();
          admin.database().ref(`/team_maps/${id}`).remove();
        });
      },

      /**
      * Deletes the directory pointed to by a specific teammap id
      * This is used when updating the file structure information for
      * the teammap
      * 
      * @param  {string} id The id of the teammap whose directory structure
      *     will be updated
      */
      deleteForUpdate: (id,admin) => {
        let directoryID;
        let teammapLoc = admin.database().ref(`/team_maps/${id}`);
        teammapLoc.once('value', (snapshot) => {
          directoryID = snapshot.val().directory;
          let directoryLoc = admin.database().ref(`/directory_trees/${directoryID}`);
  
          admin.database().ref(directoryLoc).remove();
        });
      }



}
