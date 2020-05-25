/** 
 *  @fileOverview Contains all of the event listeners that store the data in the VSCodeMetrics data structures. 
 *
 *  @author       Jack    Rose
 *  @author       Jackson Tuxhorn
 *
 *  @requires     // I don't really know 
 */

import * as vscode from 'vscode';
import {VSFolder, VSFile} from './vscodemetrics';
import {docs} from '../main';

/**
 * Function that listens to user's activities and modifies appropriately. 
 */
export function listen() {
    createFileListener();
    deleteFileListener();
    modifiedFileListener();
    foldersListener();
    createFileOrFolderRenamedListener();
    trackCurrentFile();

}
/**
 * Event listener that keeps track of when a new file is created. 
 * Adds the new file/folder into the respected created list. 
 */
async function createFileListener() {
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

                            vscode.window.showInformationMessage("createFileListener called: " + docs.getCreatedFile(fUri)?.getFileName());
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
async function deleteFileListener() {
    
    // Loop through the deleted files. 
    vscode.workspace.onDidDeleteFiles((fileDeleteEvent : vscode.FileDeleteEvent) => {
        let filesDeleted = fileDeleteEvent.files;
    
        filesDeleted.forEach((fUri) => {

            // Make sure that the uri is not undefined. 
            if(fUri !== undefined) {
    
                // Grab the file type, and add the new file or folder.  
                vscode.workspace.fs.stat(fUri).then((fileStat) => {
                    let fileType = fileStat.type;

                    console.log("Deleted object type: " + fileType);

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

                            vscode.window.showInformationMessage("deleteFileListener called: " + docs.getDeletedFile(fUri)?.getFileName());

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
 * 
 * Using this method with deleteFileListener() is probably bad.
 */
 async function foldersListener() {
    let fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*', /* ignoreCreate */ false, /* ignoreChange */ true, /* ignoreDelete */ false);

    fileSystemWatcher.onDidCreate((createdFileUri : vscode.Uri) => {
        vscode.workspace.fs.stat(createdFileUri).then((fileStat : vscode.FileStat) => {
            // Right now we only care about directories in this method.
            if(fileStat.type !== vscode.FileType.Directory){
                return;
            }

            removeDirectoryFromMaps(createdFileUri);
            
            let createdFolderName = getNameFromFileSystemPath(createdFileUri.fsPath);
            let createdFolder     = new VSFolder(createdFolderName, createdFileUri, true, vscode.FileType.Directory);

            docs.addCreatedFolder(createdFileUri, createdFolder);

            vscode.window.showInformationMessage("foldersListener add folder called: " + docs.getCreatedFolder(createdFileUri)?.getFolderName());

        });
    });

    fileSystemWatcher.onDidDelete((deletedFileUri : vscode.Uri) => {
        // Since this file doesn't exist anymore, then we can't tell if it's a directory or a file.
        // We'll just guess? ¯\_(ツ)_/¯

        

        console.log("Uri type: " + vscode.workspace.fs.stat(deletedFileUri));

        removeDirectoryFromMaps(deletedFileUri);

        let deletedFolderName = getNameFromFileSystemPath(deletedFileUri.fsPath);
        let deletedFolder     = new VSFolder(deletedFolderName, deletedFileUri, false, vscode.FileType.Directory);

        docs.addDeletedFolder(deletedFileUri, deletedFolder);

        vscode.window.showInformationMessage("foldersListener delete folder called: " + docs.getDeletedFile(deletedFileUri)?.getFileName());

    });
}

/**
 * Event listener that keeps track of when a file is modified.
 * Adds the file to the modified files list. 
 */
 async function modifiedFileListener() {
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
            docs.delDeletedFile(fUri);
        }

        let docNameArr = doc.fileName.split("\\");
        let docName = docNameArr[docNameArr.length - 1];

        let file = new VSFile(docName, fUri, true, doc.lineCount, vscode.FileType.File);

        docs.addModifiedFile(fUri, file);
        vscode.window.showInformationMessage("modifiedFileListener called: " + docs.getModifiedFile(fUri)?.getFileName());
    });
    
}


/**
 * Creates an event listener that detects changes to directory / file names
 * and updates the doc file / directory modified maps.
 * 
 * ***              THE LAST TIME THE FUNCTION CALLED AN UPDATE IT WILL HAVE oldUri                ***
 * *** IF WE WANT TO ACCESS THE FILE NOW WE HAVE TO USE newUri, AS IT'S REFLECTS CURRENT FILE NAME ***
 */
 async function createFileOrFolderRenamedListener(){
    vscode.workspace.onDidRenameFiles((fileRenameEvent : vscode.FileRenameEvent) => {
        let renamedFiles = fileRenameEvent.files;

        renamedFiles.forEach(file => {
            vscode.workspace.fs.stat(file['newUri']).then((fileStat : vscode.FileStat) =>{
                if(fileStat.type === vscode.FileType.Directory){
                    // Make sure we don't store multiple updates at once.
                    removeDirectoryFromMaps(file['oldUri']);

                    // Prepare updated info for storage in map.
                    let newName       = getNameFromFileSystemPath(file['newUri'].fsPath);
                    let updatedFolder = new VSFolder(newName, file['newUri'], false, vscode.FileType.Directory);

                    // The database will still have the old path to the directory, so we send oldUri
                    docs.addModifiedFolder(file['oldUri'], updatedFolder);
                } else if (fileStat.type === vscode.FileType.File){
                    vscode.workspace.openTextDocument(file['newUri']).then(openedFile => {
                        // Make sure we don't store multiple updates at once.
                        removeFileFromMaps(file['oldUri']);
                        
                        // Prepare updated info for storage in map.
                        let newName     = getNameFromFileSystemPath(file['newUri'].fsPath);
                        let updatedFile = new VSFile(newName, file['newUri'], false, openedFile.lineCount, vscode.FileType.File);

                        // The database will still have the old path to the directory, so we send oldUri
                        docs.addModifiedFile(file['oldUri'], updatedFile);
                        vscode.window.showInformationMessage("createFileOrFolderRenamedListener called: " + docs.getModifiedFile(file['oldUri'])?.getFileName());
                    });
                } else {
                    vscode.window.showErrorMessage("CartoGraphX: Something weird happened!");
                }
            });
        });

    });
}

/**
 * Grabs the current file that the user is working in. 
 */
 async function trackCurrentFile() {
    vscode.window.onDidChangeActiveTextEditor((openEditor : vscode.TextEditor | undefined) => {
        let curFile : string = "";

        if(openEditor !== undefined) {
            curFile = openEditor.document.uri.path;
        }


        // Update if the editor is not undefined. Otherwise, error. 
        if(curFile !== "") {
            // Sets the current file path for the doc. 
            docs.setCurrFilePath(curFile);

            vscode.window.showInformationMessage("In file " + docs.getCurrFilePath());

        }

        else {
            vscode.window.showErrorMessage("Error: current file is underfined");
        }
        

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
