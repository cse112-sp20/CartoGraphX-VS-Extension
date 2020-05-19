/**
 * This file contains the code that sends the data to firebase. 
 */
 import {auth, docs} from '../main';
 import * as vscode from 'vscode';
 import { VSFile } from './vscodemetrics';

export function sendData() {
    
    // Create the JSON object. 
    let postDocReq : any = {
        "uid": auth.currentUser?.getIdToken,        
        "createdFiles": [],
        "modifiedFiles": [],
        "deletedFiles": [],
        "createdFolders": [],
        "deletedFolders": [],
        "inFile": ""
    };
    
    // Get the created, modified, and deleted files. 
    let createdFiles = docs.getCreatedFilesMap();
    let modifiedFiles = docs.getModifiedFilesMap();
    let deletedFiles = docs.getDeletedFilesMap();

    // Get the created and deleted folders. 
    let createdFolders = docs.getCreatedFoldersMap();
    let deletedFolders = docs.getDeletedFoldersMap();

    // Loop through the files and get the paths to the created files. 
    createdFiles.forEach((value: VSFile, key: vscode.Uri) => {
        postDocReq["createdFiles"].push(value.getFilePath());
    });

    // Loop through the files and get the paths to the modified files. 
    modifiedFiles.forEach((value: VSFile, key: vscode.Uri) => {
        let modifiedFileInfo : any = {};
        modifiedFileInfo["filename"] = value.getFilePath();
        modifiedFileInfo["lineCount"] = value.getNumLines();
        let modifiedFileInfoJSON = <JSON>modifiedFileInfo;
        postDocReq["modifiedFiles"].push(modifiedFileInfoJSON);
    });
    
    // Loop through the files and get the paths to the deleted files.
    deletedFiles.forEach((value: VSFile, key: vscode.Uri) => {
        postDocReq["deletedFiles"].push(value.getFilePath());
    });


    // Get the path of the file that the user is currently in. 
    postDocReq["inFile"] = docs.getCurrFilePath();


    // Convert into a JSON object and send the request:
    let postDocReqJSON = <JSON>postDocReq;
   

    let req = new XMLHttpRequest();

    vscode.window.showInformationMessage("made it here");
    
    req.open('POST', 'https://us-central1-remote-13.cloudfunctions.net/addItem', true);

    // Send it over to Firebase. 
    auth.currentUser?.getIdToken(true).then((idToken: string) =>{
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('idToken', idToken);
        req.send(JSON.stringify(postDocReqJSON));
    })
    .catch((error : any) => {

    });


    // req.send(JSON.stringify(postDocReqJSON));
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

};