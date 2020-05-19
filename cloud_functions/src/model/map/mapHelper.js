

module.exports = {

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
    
      getAddedTeamMap: (res) => {
        return teammap.on('child_added', (snapshot) => {
          res.status(200).json(snapshot.val());
        }, (error) => {
          res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
          });
        });
      },

      deleteTeammap: (id,admin) => {
        let directoryID;
        let teammapLoc = admin.database().ref(`/team_maps/${id}`);
        teammapLoc.once('value', (snapshot) => {
          directoryID = snapshot.val().directory;
          let directoryLoc = admin.database().ref(`/directory_trees/${directoryID}`);
  
          // directoryLoc.on('value', (snapshot2) => {
          //   var fileList = snapshot2.val().fileKeys;
          //   for (f in fileList) {
          //     var fileKey = fileList[f];
          //     admin.database().ref(`files/${fileKey}`).remove();
          //   } 
          // })
  
          admin.database().ref(directoryLoc).remove();
          admin.database().ref(`/team_maps/${id}`).remove();
        });
      },

      deleteForUpdate: (id,admin) => {
        let directoryID;
        let teammapLoc = admin.database().ref(`/team_maps/${id}`);
        teammapLoc.once('value', (snapshot) => {
          directoryID = snapshot.val().directory;
          let directoryLoc = admin.database().ref(`/directory_trees/${directoryID}`);
  
          // directoryLoc.on('value', (snapshot2) => {
          //   var fileList = snapshot2.val().fileKeys;
          //   for (f in fileList) {
          //     var fileKey = fileList[f];
          //     admin.database().ref(`files/${fileKey}`).remove();
          //   } 
          // })
  
          admin.database().ref(directoryLoc).remove();
        });
      }



}