const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const mapHelper = require('./directoryTreeHelper');

const database = admin.database().ref('/items');
const teammap = admin.database().ref('/team_maps');
const directoryTree = admin.database().ref('/directory_trees');
const files = admin.database().ref('/files');

const router = require('express').Router();


/**
* Cloud function to add a teammap by providing the folder name, 
* list of files, list of folders, as well as editors and number
* of lines in each file
*
* @param    {XMLHttpRequest} req The request that was sent in to this
*     cloud function
*/
router.post('/addItem', (req, res) => {
      //const directory = req.body.directory;
      const github_token_id = req.body.github_token_id;
      const users = req.body.users; // users is an array
      const root_folder = req.body.root_folder;
      const file_list = req.body.files;
  
      // "root_folder": {
      //   "folder_name": "TESTROOT",
      //   "folders": ["src", "src/test"],
      //   "files": ["src/file1.js", "src/file2.js", "src/test/file3.js"]
      // },
      let directory = directoryTree.push(root_folder).key; 
  
      // "files": [{"current_editors": ["Person1", "Person2"], "filename": "src/file1.js", "number_of_lines": 8000},  
      // {"current_editors": ["Person3", "Person4"], "filename": "src/file2.js", "number_of_lines": 4000}, 
      // {"current_editors": ["Person5"], "filename": "src/test/file3.js", "number_of_lines": 2000}]
      let fileKeys = {};
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
  
      teammap.push({ directory, github_token_id, users });
  
      mapHelper.getAddedTeamMap(res,admin);
});

/**
* Calls getItemsFromDatabase helper function in order to return the
* teammaps in the database
*
* @param    {XMLHttpRequest} req The request sent into this cloud function
*/
router.get('/getItems', (req,res) => {
      mapHelper.getItemsFromDatabase(res,admin);
});

/**
* Cloud function to delete a teammap based on a given id
*
* @param    {XMLHttpRequest} req The request sent to this cloud function
*/
router.delete('/delete', (req,res) =>{
      const id = req.query.id;
      mapHelper.deleteTeammap(id,admin);
      //let directoryID = teammap.child(id).

      mapHelper.getItemsFromDatabase(res,admin);
});


/**
* Cloud function to update the directory structure of a given teammap,
* based on the teammap id and the specified directory structure
*
* @param    {XMLHttpRequest} req The request sent to this cloud function
*/
router.put('/update',(req,res) =>{
      const id = req.query.id;
      const github_token_id = req.body.github_token_id;
      const users = req.body.users; // users is an array
      const root_folder = req.body.root_folder;
      const file_list = req.body.files;

      mapHelper.deleteForUpdate(id,admin);

      // "root_folder": {
      //   "folder_name": "TESTROOT",
      //   "folders": ["src", "src/test"],
      //   "files": ["src/file1.js", "src/file2.js", "src/test/file3.js"]
      // },
      let directory = directoryTree.push(root_folder).key; 

      // "files": [{"current_editors": ["Person1", "Person2"], "filename": "src/file1.js", "number_of_lines": 8000},  
      // {"current_editors": ["Person3", "Person4"], "filename": "src/file2.js", "number_of_lines": 4000}, 
      // {"current_editors": ["Person5"], "filename": "src/test/file3.js", "number_of_lines": 2000}]
      let fileKeys = {};
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
      
      mapHelper.getItemsFromDatabase(res,admin);

});

module.exports = router;
