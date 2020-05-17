/** 
 *  @fileOverview Implements the event listeners to detect changes to local project.
 *
 *  @author       Jack    Rose
 *  @author       Jackson Tuxhorn
 *
 *  @requires     // I don't really know 
 */


import * as vscode from 'vscode';
import {VSFolder, VSFile} from './vscodemetrics';
import {docs} from '../main';
import { rename } from 'fs';

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


/**
 * Creates an event listener that detects changes to directory / file names
 * and updates the doc file / directory modified maps.
 * 
 * *** THE LAST TIME THE FUNCTION CALLED AN UPDATE IT WILL HAVE oldUri ***
 * *** IF WE WANT TO ACCESS THE FILE NOW WE HAVE TO USE newUri, AS IT'S REFLECTS CURRENT FILE NAME ***
 */
export function createFileOrFolderRenamedListener(){
    vscode.workspace.onDidRenameFiles((fileRenameEvent : vscode.FileRenameEvent) => {
        let renamedFiles = fileRenameEvent.files;

        renamedFiles.forEach(file => {
            vscode.workspace.fs.stat(file['newUri']).then((fileStat : vscode.FileStat) =>{
                if(fileStat.type == vscode.FileType.Directory){
                    // Make sure we don't store multiple updates at once.
                    removeDirectoryFromMaps(file['oldUri']);

                    // Prepare updated info for storage in map.
                    let newName       = getNameFromFileSystemPath(file['newUri'].fsPath);
                    let updatedFolder = new VSFolder(newName, file['newUri'], false, vscode.FileType.Directory);

                    // The database will still have the old path to the directory, so we send oldUri
                    docs.addModifiedFolder(file['oldUri'], updatedFolder);
                } else if (fileStat.type == vscode.FileType.File){
                    vscode.workspace.openTextDocument(file['newUri']).then(openedFile => {
                        // Make sure we don't store multiple updates at once.
                        removeFileFromMaps(file['oldUri']);
                        
                        // Prepare updated info for storage in map.
                        let newName     = getNameFromFileSystemPath(file['newUri'].fsPath);
                        let updatedFile = new VSFile(newName, file['newUri'], false, openedFile.lineCount, vscode.FileType.File);
    
    
                        // The database will still have the old path to the directory, so we send oldUri
                        docs.addModifiedFile(file['oldUri'], updatedFile)
                    });
                } else {
                    vscode.window.showErrorMessage("CartoGraphX: Something weird happened!");
                }
            })
        })

    });
}

/**
 * Extracts the name of the File with the given File System Path.
 * @param fsPath fsPath of Uri of File.
 */
function getNameFromFileSystemPath(fsPath : string){
    let docNameArr = fsPath.split("\\");
    return docNameArr[docNameArr.length - 1];
}

/**
 * Removes the key from all doc folder update maps.
 * @param folderUri Uri of directory to remove from maps.
 */
function removeDirectoryFromMaps(folderUri : vscode.Uri){
    if(docs.hasCreatedFolder(folderUri)) {
        docs.delCreatedFolder(folderUri);
    }

    if(docs.hasModifiedFolder(folderUri)) {
        docs.delModifiedFolder(folderUri);
    }

    if(docs.hasDeletedFolder(folderUri)) {
        docs.delDeletedFolder(folderUri);
    }
}

/**
 * Removes the key from all doc file update maps.
 * @param folderUri Uri of file to remove from maps.
 */
function removeFileFromMaps(fileUri : vscode.Uri){
    if(docs.hasCreatedFile(fileUri)) {
        docs.delCreatedFile(fileUri);
    }

    if(docs.hasModifiedFile(fileUri)) {
        docs.delModifiedFile(fileUri);
    }

    if(docs.hasDeletedFile(fileUri)) {
        docs.hasDeletedFile(fileUri);
    }
}