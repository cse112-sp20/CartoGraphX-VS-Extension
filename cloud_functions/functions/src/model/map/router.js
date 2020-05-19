const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

const database = admin.database().ref('/items');
const teammap = admin.database().ref('/team_maps');
const directoryTree = admin.database().ref('/directory_trees');
const files = admin.database().ref('/files');


const router = require('express').Router();

const mapHelper = require('./mapHelper');

router.post('/createMap', (req,res) => {
    let github_repo_name = req.body.github_repo_name;
    let github_repo_url  = req.body.github_repo_url;
    let github_repo_file_trees = req.body.github_repo_file_trees;


    let mapObject = {
        files_changes:{
            added_files:[],
            deleted_files:[],
            moditified_files:[]
        },
        github_repo_name: github_repo_name,
        github_repo_url : github_repo_url,
        directory : ""
    };

    let newTeammapRef = teammap.push(mapObject);

    let newTeammapKey = newTeammapRef.key;


    let fileKeys = mapHelper.updateFilesToDB(newTeammapKey,github_repo_file_trees,files);

    let fileTree = mapHelper.convertFilesToJSON(fileKeys, github_repo_name);

    let newDirectoryRef = directoryTree.push(fileTree);

    let newDirectoryKey = newDirectoryRef.key;

    teammap.child(newTeammapKey).update({
        rootFolder: newDirectoryKey
    });


    res.status(404).json({success: false, data: "Endpoint is not valid"});
});


// router.post('/currentEdit', (req,res) => {
//     let github_repo_name = req.body.github_repo_name;
//     let github_repo_url  = req.body.github_repo_url;
//     let filepath         = req.body.filepath;

    

// });


module.exports = router;