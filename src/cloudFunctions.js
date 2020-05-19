const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/items');
const teammap = admin.database().ref('/team_maps');
const directoryTree = admin.database().ref('/directory_trees');
const files = admin.database().ref('/files');
const users = admin.database().ref('/users');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from a Serverless Database!");
});

const getItemsFromDatabase = (res) => {
  let maps = [];

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
};

const getAddedTeamMap = (res) => {
  return teammap.on('child_added', (snapshot) => {
    res.status(200).json(snapshot.val());
  }, (error) => {
    res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
    });
  });
};

function deleteTeammap(id) {
  var directoryID;
      var teammapLoc = admin.database().ref(`/team_maps/${id}`);
      teammapLoc.once('value', (snapshot) => {
        directoryID = snapshot.val().directory;
        var directoryLoc = admin.database().ref(`/directory_trees/${directoryID}`);

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
} 

function deleteForUpdate(id) {
  var directoryID;
      var teammapLoc = admin.database().ref(`/team_maps/${id}`);
      teammapLoc.once('value', (snapshot) => {
        directoryID = snapshot.val().directory;
        var directoryLoc = admin.database().ref(`/directory_trees/${directoryID}`);

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

exports.addItem = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if(req.method !== 'POST') {
          return res.status(401).json({
            message: 'Not allowed'
          })
        };
        const uid = req.body.uid;
        const createdFiles = req.body.createdFiles;
        const modifiedFiles = req.body.modifiedFiles;
        const deletedFiles = req.body.deletedFiles;
    
        users.once('value', (snapshot) => {
          let teammapID = snapshot.child(uid).val().team_maps;
          let userName = snapshot.child(uid).val().firstName;
          let teammapLoc = teammap.child(teammapID);
          let addedFilesLoc = teammapLoc.child('files_changes/added_files');
          let modifiedFilesLoc = teammapLoc.child('files_changes/modified_files');
          let deletedFilesLoc = teammapLoc.child('files_changes/deleted_files');
          
          createdFiles.forEach((createdFile) => {
    
            let filename = createdFile;
            let revisedFilename1 = filename.replace(/\//g, '_');
      
            // turns / to _ and . to , so it can be added to firebase
            let revisedFilename2 = revisedFilename1.replace('.', ','); 
    
            let fileID = teammapID.concat("@", revisedFilename2);
            addedFilesLoc.child(fileID).child(userName).set("");
          });
    
          modifiedFiles.forEach((modifiedFile) => {
    
              let filename = modifiedFile.filename;
              let linecount = modifiedFile.linecount;
              let revisedFilename1 = filename.replace(/\//g, '_');
        
              // turns / to _ and . to , so it can be added to firebase
              let revisedFilename2 = revisedFilename1.replace('.', ','); 
    
              let fileID = teammapID.concat("@", revisedFilename2);
              modifiedFilesLoc.child(fileID).child(userName).set(linecount);
          });
    
          deletedFiles.forEach((deletedFile) => {
    
              let filename = deletedFile;
              let revisedFilename1 = filename.replace(/\//g, '_');
        
              // turns / to _ and . to , so it can be added to firebase
              let revisedFilename2 = revisedFilename1.replace('.', ','); 
    
              let fileID = teammapID.concat("@", revisedFilename2);
              deletedFilesLoc.child(fileID).child(userName).set("");
          });
        });
      });
});

exports.getItems = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    };
    getItemsFromDatabase(res);
  });
});

exports.delete = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
      if(req.method !== 'DELETE') {
        return res.status(401).json({
          message: 'Not allowed'
        });
      }
      const id = req.query.id;
      deleteTeammap(id);
      //let directoryID = teammap.child(id).

      getItemsFromDatabase(res);
    });
});

exports.update = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if(req.method !== 'PUT') {
          return res.status(401).json({
            message: 'Not allowed'
          });
        };
        const id = req.query.id;
        const github_token_id = req.body.github_token_id;
        const users = req.body.users; // users is an array
        const root_folder = req.body.root_folder;
        const file_list = req.body.files;

        deleteForUpdate(id);

        // "root_folder": {
        //   "folder_name": "TESTROOT",
        //   "folders": ["src", "src/test"],
        //   "files": ["src/file1.js", "src/file2.js", "src/test/file3.js"]
        // },
        var directory = directoryTree.push(root_folder).key; 

        // "files": [{"current_editors": ["Person1", "Person2"], "filename": "src/file1.js", "number_of_lines": 8000},  
        // {"current_editors": ["Person3", "Person4"], "filename": "src/file2.js", "number_of_lines": 4000}, 
        // {"current_editors": ["Person5"], "filename": "src/test/file3.js", "number_of_lines": 2000}]
        var fileKeys = {};
        file_list.forEach((file) => {
          let filename = file.filename;
          let revisedFilename1 = filename.replace(/\//g, '_');

          // turns / to _ and . to , so it can be added to firebase
          let revisedFilename2 = revisedFilename1.replace('.', ','); 
          let fileKey = files.push({
            current_editors: file.current_editors, 
            filename: file.filename, 
            number_of_lines: file.number_of_lines}).key;
          fileKeys[revisedFilename2] = fileKey.toString();
        });

        // add all the files and their keys to directoryTree
        directoryTree.child(`${directory}/fileKeys`).set(fileKeys);

        teammap.child(`${id}`).set({ github_token_id, users });
        
        getItemsFromDatabase(res);
      });
});