const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

const database = admin.database().ref('/items');
const teammap = admin.database().ref('/team_maps');
const directoryTree = admin.database().ref('/directory_trees');
const files = admin.database().ref('/files');


const router = require('express').Router();

const mapHelper = require('./mapHelper');

/**
* Cloud function to add a teammap to firebase, given a github repository name,
* the url to the repo, and a map from file names to the number of lines in the 
* files
*
* @param    {XMLHttpRequest} req The request sent to this function which has
*   the github repo name, url, and map of files in the body of the JSON
*/
router.post('/createMap', (req,res) => {
    let github_repo_name = req.body.github_repo_name;
    let github_repo_url  = req.body.github_repo_url;
    let github_repo_file_trees = req.body.github_repo_file_trees;


    // Add modifications to the files into an object called mapObject
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


/**
* Cloud function that update the user's current editting file in a particualr teammap
*
* @param    {XMLHttpRequest} req The request sent to this function which has
*   the github repo name, url, and the map key
*/
router.post('/currentEdit', (req,res) => {
    let github_repo_name  = req.body.github_repo_name;
    let github_repo_url   = req.body.github_repo_url;
    let filepath          = mapHelper.sensitizeFilePath(req.body.filepath);
    let mapKey           = req.body.map_key;
    let userName          = req.userName;

    teammap.child(map_key + "/current_editors").update(userName,mapKey+"@"+filepath);

    res.status(200).json({});

});


/**
* Cloud function that allow the user to join a teammap based on a map key
*
* @param    {XMLHttpRequest} req The request sent to this function which has
*   the map key
*/
router.post('/joinMap', (req,res) => {
    const body = JSON.parse(req.body);
    let mapKey           = body.mapKey;
    let userID           = req.userID;

    admin.database().ref('/users/' + userID + "/team_maps").update({ [mapKey] : true},function(snapshot){
        res.status(204);
    }).catch(e =>{
        res.status(400).json({error});
    });


});

/**
* Cloud function that show all the maps this user belong to
*
* @param    {XMLHttpRequest} req The request body is empty
*/
router.get('/showMaps', (req, res) =>{
    let userID           = req.userID;
    admin.database().ref('/users/' + userID + "/team_maps").once("value", function(snapshot){
        let result = snapshot.val();
        res.status(200).json({result});
    }).catch(function(error){
        res.status(400).json({error});
    });

});

module.exports = router;
