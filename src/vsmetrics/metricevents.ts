/**
 * This file contains all of the event listeners that store the data in the VSCodeMetrics data structures. 
 */


import * as vscode from 'vscode';
import {VSFolder, VSFile} from './vscodemetrics';
import {docs} from '../main';


function createFilesListener() {
    // Loop through the created files. 
    vscode.workspace.onDidCreateFiles((fileCreateEvent : vscode.FileCreateEvent) => {
        let filesCreated = fileCreateEvent.files;
    
        filesCreated.forEach((fUri) => {

            // Make sure that the uri is not undefined. 
            if(fUri !== undefined) {
    
                // Grab the file type, and add the new file or folder.  
                vscode.workspace.fs.stat(fUri).then((fileStat) => {
                    let fileType = fileStat.type;

                    if(fileType === vscode.FileType.File) {

                        vscode.window.showInformationMessage("Adding file at path " + fUri.fsPath);

                        // Delete the uri file from the lists if they exist. 
                        if(docs.hasCreatedFile(fUri)) {
                            docs.delCreatedFile(fUri);
                        }

                        if(docs.hasModifiedFile(fUri)) {
                            docs.delModifiedFile(fUri);
                        }

                        if(docs.hasDeletedFile(fUri)) {
                            docs.delDeletedFile(fUri);
                        }
                        
                        // Create an instance of a text document for the fileUri (gets the file name and line count)
                        vscode.workspace.openTextDocument(fUri).then(doc => {
                            
                            // Create a new file based on the info from the document and fileUri.
                            let file = new VSFile(doc.fileName, fUri, true, fileType, doc.lineCount);

                            // Add the (uri, file) to the map.
                            docs.addCreatedFile(fUri, file);

                        });
                
                    }

                    else if(fileType === vscode.FileType.Directory) {
                        vscode.window.showInformationMessage("Adding folder at path " + fUri.fsPath);

                        // Delete the uri file from the lists if they exist. 
                        if(docs.hasCreatedFolder(fUri)) {
                            docs.delCreatedFile(fUri);
                        }

                        if(docs.hasModifiedFolder(fUri)) {
                            docs.delModifiedFile(fUri);
                        }

                        if(docs.hasDeletedFolder(fUri)) {
                            docs.delDeletedFolder(fUri);
                        }

                        // Get the folder name. 
                        let folderNameUri = fUri.toString().split("/");
                        let folderName = folderNameUri[folderNameUri.length - 1];

                        if(fUri.toString() === "/" || fUri.toString() === "~/") {
                            folderName = fUri.toString();
                        }

                        else {

                            if(folderName === "" && folderNameUri.length > 0) {
                                folderName = folderNameUri[folderNameUri.length - 2];
                            }
                        }

                        let folder = new VSFolder(folderName, fUri, true, fileType);

                        docs.addCreatedFolder(fUri, folder);
                    }                 
                });      
            }              
        });
    });
}

// function changeTextDocumentListener() {
//     vscode.workspace.onDidChangeTextDocument((textDocChangeEvent : vscode.TextDocumentChangeEvent) => {
//         let document     : vscode.TextDocument = textDocChangeEvent.document;
//         let documentName : string              = document.fileName;
//         let documentURI  : vscode.Uri          = document.uri;
    
//         // If our document is already queued for changes in fileChanges, then remove the old and just add the new one.
//         // If the file is not already queued for an update, then only add a new FileChange.
//     });
// }



// function deleteFilesListener(){
//     vscode.workspace.onDidDeleteFiles((fileDeleteEvent) => {

//     });
// }