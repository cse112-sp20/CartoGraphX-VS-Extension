/**
 * This file contains the code that sends the data to firebase. 
 */
 import {auth, docs} from '../main';
 import * as vscode from 'vscode';
 import { VSFile, VSFolder } from './vscodemetrics';
 import {XMLHttpRequest} from 'xmlhttprequest-ts';

export function sendData() {

    vscode.window.showInformationMessage("sendData has been called!");
    
    // Create the JSON object. 
    let postAddItems : any = {
        "uid": "",        
        "createdFiles": [],
        "modifiedFiles": [],
        "deletedFiles": [],
        "createdFolders": [],
        "deletedFolders": [],
        "inFile": ""
    };


    // Parse the lists and format the values of the request. 
    parseLists(postAddItems);    

    // Add the current file that the user is in. 
    postAddItems["inFile"] = docs.getCurrFilePath();

    // Begin the request and open it. 
    let req = new XMLHttpRequest();   
    
    req.open('POST', 'https://ena1vcfxyrgqd.x.pipedream.net', true);

    vscode.window.showInformationMessage("Request was created and opened.");

    
    
    // eslint-disable-next-line no-unused-expressions
    auth.currentUser?.getIdToken(true).then((idToken: string) => {

        vscode.window.showInformationMessage("Gets passed auth check.");

        req.setRequestHeader("idToken", idToken);

        // Type cast to JSON and send request.
        let postAddItemsJSON = <JSON>postAddItems;

        req.send(JSON.stringify(postAddItemsJSON));

        // Clear the lists once the JSON is sent. 
        clearLists();

    })
    .catch((error : any) => {
        vscode.window.showErrorMessage(error.toString());
    });

    vscode.window.showInformationMessage("test request was called");


    // Tells us if the request was successfully implemented.
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                vscode.window.showInformationMessage("request went through");
            } else {
                vscode.window.showInformationMessage(req.status.toString());
            }
        }
    };

}

function parseLists(JSONObj : any) {
    // Get the created, modified, and deleted files. 
    let createdFiles = docs.getCreatedFilesMap();
    let modifiedFiles = docs.getModifiedFilesMap();
    let deletedFiles = docs.getDeletedFilesMap();

    // Get the created and deleted folders. 
    let createdFolders = docs.getCreatedFoldersMap();
    let deletedFolders = docs.getDeletedFoldersMap();


    // Create the arrays that will be sent in the post req to FB. 
    let createdFilesJSON : any = [];
    let modifiedFilesJSON : any = [];
    let deletedFilesJSON : any = [];
    let createdFoldersJSON : any = [];
    let deletedFoldersJSON : any = [];


    // Loop through the files and get the paths to the created files. 
    createdFiles.forEach((value: VSFile, key: vscode.Uri) => {
        createdFilesJSON.push(value.getFilePath());
    });

    vscode.window.showInformationMessage("Added created files.");

    // Loop through the files and get the paths to the modified files. 
    modifiedFiles.forEach((value: VSFile, key: vscode.Uri) => {
        let modifiedFileInfo : any = {};
        modifiedFileInfo["filename"] = value.getFilePath();
        modifiedFileInfo["linecount"] = value.getNumLines();
        modifiedFilesJSON.push(modifiedFileInfo);
    });

    vscode.window.showInformationMessage("Added modified files.");

    
    // Loop through the files and get the paths to the deleted files.
    deletedFiles.forEach((value: VSFile, key: vscode.Uri) => {
        deletedFilesJSON.push(value.getFilePath());
    });

    vscode.window.showInformationMessage("Added deleted files.");


    // Loop through the folders and get the paths to the created folders. 
    createdFolders.forEach((value: VSFolder, key: vscode.Uri) => {
        createdFoldersJSON.push(value.getFolderPath());
    });

    vscode.window.showInformationMessage("Added created folders.");


    // Loop through the folders and get the paths to the deleted folders. 
    deletedFolders.forEach((value: VSFolder, key: vscode.Uri) => {
        deletedFoldersJSON.push(value.getFolderPath());
    });

    vscode.window.showInformationMessage("Added deleted folders.");


    // Add the lists into the JSON object. 
    JSONObj["createdFiles"] = createdFilesJSON;
    JSONObj["modifiedFiles"] = modifiedFilesJSON;
    JSONObj["deletedFiles"] = deletedFilesJSON;
    JSONObj["createdFolders"] = createdFoldersJSON;
    JSONObj["deletedFolders"] = deletedFoldersJSON; 
}

function clearLists() {
    // Get the created, modified, and deleted files. 
    let createdFiles = docs.getCreatedFilesMap();
    let modifiedFiles = docs.getModifiedFilesMap();
    let deletedFiles = docs.getDeletedFilesMap();

    // Get the created and deleted folders. 
    let createdFolders = docs.getCreatedFoldersMap();
    let deletedFolders = docs.getDeletedFoldersMap();


    // Clear them.
    createdFiles.clear();
    modifiedFiles.clear();
    deletedFiles.clear();
    createdFolders.clear();
    deletedFolders.clear();
}