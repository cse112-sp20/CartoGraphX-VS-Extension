/**
 * This file contains all of the event listeners that store the data in the VSCodeMetrics data structures. 
 */


import * as vscode from 'vscode';
import {VSFolder, VSFile} from './vscodemetrics';
import {docs} from '../main';

/**
 * Event listener that keeps track of when a new file is created. 
 * Adds the new file/folder into the respected created list. 
 */
export function createFileListener() {
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

                            let fileNameArr = doc.fileName.split("\\");

                            let fileName = fileNameArr[fileNameArr.length - 1];
                            
                            // Create a new file based on the info from the document and fileUri.
                            let file = new VSFile(fileName, fUri, true, fileType, doc.lineCount);

                            // Add the (uri, file) to the map.
                            docs.addCreatedFile(fUri, file);
                        });
                
                    }
                    
                    else {
                        vscode.window.showErrorMessage("Error: Not type File (1): " + fileType.toString());
                    }
                });      
            }              
        });
    });
}


/**
 * Event listener that keeps track of when a file is deleted. 
 * Adds the old file into the deleted files list. 
 */
export function deleteFileListener() {
    
    // Loop through the deleted files. 
    vscode.workspace.onDidDeleteFiles((fileDeleteEvent : vscode.FileDeleteEvent) => {
        let filesDeleted = fileDeleteEvent.files;
    
        filesDeleted.forEach((fUri) => {

            // Make sure that the uri is not undefined. 
            if(fUri !== undefined) {
    
                // Grab the file type, and add the new file or folder.  
                vscode.workspace.fs.stat(fUri).then((fileStat) => {
                    let fileType = fileStat.type;

                    if(fileType === vscode.FileType.File) {

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

                            let fileNameArr = doc.fileName.split("\\");

                            let fileName = fileNameArr[fileNameArr.length - 1];
                            
                            // Create a new file based on the info from the document and fileUri.
                            let file = new VSFile(fileName, fUri, false, fileType, doc.lineCount);

                            // Add the (uri, file) to the map.
                            docs.addDeletedFile(fUri, file);
                        });
                
                    }
                    
                    else {
                        vscode.window.showErrorMessage("Error: Not type File (1): " + fileType.toString());
                    }
                });      
            }              
        });
    });
}


/**
 * Event listener that keeps track of when a new folder is created. 
 * Adds the new folder into the respected created list. 
 */
export function FoldersListener() {
    // Loop through the created files. 
    vscode.workspace.onDidChangeWorkspaceFolders((folderCreateEvent : vscode.WorkspaceFoldersChangeEvent) => {
        let addedFolders = folderCreateEvent.added;
        let deletedFolders = folderCreateEvent.removed;
    
        // Handle created folders:
        addedFolders.forEach((folder) => {

            // Make sure that the folder is not undefined. 
            if(folder !== undefined) {

                    let folderUri = folder.uri;
    
                    // Delete the uri file from the lists if they exist. 
                    if(docs.hasCreatedFolder(folderUri)) {
                        docs.delCreatedFolder(folderUri);
                    }

                    if(docs.hasModifiedFolder(folderUri)) {
                        docs.delModifiedFolder(folderUri);
                    }

                    if(docs.hasDeletedFolder(folderUri)) {
                        docs.delDeletedFolder(folderUri);
                    }

                    // Get the folder name. 
                    let vsFolderNameArr = folder.name.split("\\");

                    let vsFolderName = vsFolderNameArr[vsFolderNameArr.length - 1];

                    let vsFolder = new VSFolder(vsFolderName, folderUri, true, vscode.FileType.Directory);
                    
                    // Add the created folder to the created folder list.
                    docs.addCreatedFolder(folderUri, vsFolder);
            }
        });
        
        // Handle delted folders:
        deletedFolders.forEach((folder) => {

            // Make sure that the folder is not undefined. 
            if(folder !== undefined) {

                let folderUri = folder.uri;

                // Delete the uri file from the lists if they exist. 
                if(docs.hasCreatedFolder(folderUri)) {
                    docs.delCreatedFolder(folderUri);
                }

                if(docs.hasModifiedFolder(folderUri)) {
                    docs.delModifiedFolder(folderUri);
                }

                if(docs.hasDeletedFolder(folderUri)) {
                    docs.delDeletedFolder(folderUri);
                }

                // Get the folder name. 

                let vsFolderNameArr = folder.name.split("\\");

                let vsFolderName = vsFolderNameArr[vsFolderNameArr.length - 1];

                let vsFolder = new VSFolder(vsFolderName, folderUri, false, vscode.FileType.Directory);
                
                // Add the delted folder to the deleted folder list. 
                docs.addDeletedFolder(folderUri, vsFolder);
            }

        });

    });
}

/**
 * Event listener that keeps track of when a file is modified.
 * Adds the file to the modified files list. 
 */
export function changeTextDocumentListener() {
    vscode.workspace.onDidChangeTextDocument((textDocChangeEvent : vscode.TextDocumentChangeEvent) => {
        let doc = textDocChangeEvent.document;

        let fUri = doc.uri;

        // Delete the uri file from the lists if they exist. 
        if(docs.hasCreatedFile(fUri)) {
            docs.delCreatedFile(fUri);
        }

        if(docs.hasModifiedFile(fUri)) {
            docs.delModifiedFile(fUri);
        }

        if(docs.hasDeletedFile(fUri)) {
            docs.hasDeletedFile(fUri);
        }

        let docNameArr = doc.fileName.split("\\");
        let docName = docNameArr[docNameArr.length - 1];

        let file = new VSFile(docName, fUri, true, doc.lineCount, vscode.FileType.File);

        docs.addModifiedFile(fUri, file);
        
    });
}