/**
 * File that contains the data structures for storing the VSCode metrics.
 */

import * as vscode from 'vscode';

/**
 * Class that contains the data structures for the VSCode metrics. 
 */
export class VSMetrics {
    private createdFiles : Map<vscode.Uri, VSFile>;
    private modifiedFiles : Map<vscode.Uri, VSFile>;
    private deletedFiles : Map<vscode.Uri, VSFile>;

    private createdFolders : Map<vscode.Uri, VSFolder>;
    private modifiedFolders : Map<vscode.Uri, VSFolder>;
    private deletedFolders : Map<vscode.Uri, VSFolder>;

    private currFilePath : string;

    constructor() {
        this.createdFiles = new Map();
        this.modifiedFiles = new Map();
        this.deletedFiles = new Map();
        this.createdFolders = new Map();
        this.modifiedFolders = new Map();
        this.deletedFolders = new Map();
        this.currFilePath = "";
    }

    /**
     * Sets the file path the user is currently working in. 
     */
    setCurrFilePath = (currFilePath : string) => {
        this.currFilePath = currFilePath;
    };

    /**
     * Gets the file path the user is currently working in. 
     */
    getCurrFilePath = () => {
        return this.currFilePath;
    };

    /**
     * Adds an element to each of the lists:
     * @param Uri Contains the VSCode file or folder uri (key)
     * @param f Contains the file or folder (value)
     */
    addCreatedFile = (fileUri : vscode.Uri, file : VSFile) => {
        this.createdFiles.set(fileUri, file);
    };

    addModifiedFile = (fileUri : vscode.Uri, file : VSFile) => {
        this.modifiedFiles.set(fileUri, file);
    };

    addDeletedFile = (fileUri : vscode.Uri, file : VSFile) => {
        this.deletedFiles.set(fileUri, file);
    };

    addCreatedFolder = (folderUri : vscode.Uri, folder : VSFolder) => {
        this.createdFolders.set(folderUri, folder);
    };

    addModifiedFolder = (folderUri : vscode.Uri, folder : VSFolder) => {
        this.modifiedFolders.set(folderUri, folder);
    };

    addDeletedFolder = (folderUri : vscode.Uri, folder : VSFolder) => {
        this.deletedFolders.set(folderUri, folder);
    };

    /**
     * Gets a value from the lists:
     * @param Uri Contains the VSCode file or folder uri (key)
     * @return Returns either the element or undefined if the element is not present.
     */

    getCreatedFile = (fileUri : vscode.Uri) => {
        return this.createdFiles.get(fileUri);
    };

    getModifiedFile = (fileUri : vscode.Uri) => {
        return this.modifiedFiles.get(fileUri);
    };

    getDeletedFile = (fileUri : vscode.Uri) => {
        return this.deletedFiles.get(fileUri);
    };

    getCreatedFolder = (folderUri : vscode.Uri) => {
        return this.createdFolders.get(folderUri);
    };

    getModifiedFolder = (folderUri : vscode.Uri) => {
        return this.modifiedFolders.get(folderUri);
    };

    getDeletedFolder = (folderUri : vscode.Uri) => {
        return this.deletedFolders.get(folderUri);
    }; 
    
    /**
     * Tells whether the key is in the list or not:
     * @param Uri Contains the VSCode file or folder uri (key)
     * @return Returns true if the element is present, false otherwise. 
     */

    hasCreatedFile = (fileUri : vscode.Uri) => {
        return this.createdFiles.has(fileUri);
    };

    hasModifiedFile = (fileUri : vscode.Uri) => {
        return this.modifiedFiles.has(fileUri);
    };

    hasDeletedFile = (fileUri : vscode.Uri) => {
        return this.deletedFiles.has(fileUri);
    };

    hasCreatedFolder = (folderUri : vscode.Uri) => {
        return this.createdFolders.has(folderUri);
    };

    hasDeletedFolder = (folderUri : vscode.Uri) => {
        return this.deletedFolders.has(folderUri);
    };

    hasModifiedFolder = (folderUri : vscode.Uri) => {
        return this.modifiedFolders.has(folderUri);
    };

    /**
     * Deletes a value from the lists:
     * @param Uri Contains the VSCode file or folder uri (key)
     * @return Returns either the element or undefined if the element is not present.
     */

    delCreatedFile = (fileUri : vscode.Uri) => {
        return this.createdFiles.delete(fileUri);
    };

    delModifiedFile = (fileUri : vscode.Uri) => {
        return this.modifiedFiles.delete(fileUri);
    };

    delDeletedFile = (fileUri : vscode.Uri) => {
        return this.deletedFiles.delete(fileUri);
    };

    delCreatedFolder = (folderUri : vscode.Uri) => {
        return this.createdFolders.delete(folderUri);
    };

    delModifiedFolder = (folderUri : vscode.Uri) => {
        return this.modifiedFolders.delete(folderUri);
    };

    delDeletedFolder = (folderUri : vscode.Uri) => {
        return this.deletedFolders.delete(folderUri);
    }; 

    /**
     * Gets the data fields. 
     */
    getCreatedFilesMap = () => {
        return this.createdFiles;
    };

    getModifiedFilesMap = () => {
        return this.modifiedFiles;
    };

    getDeletedFilesMap = () => {
        return this.deletedFiles;
    };

    getCreatedFoldersMap = () => {
        return this.createdFolders;
    };
    
    getModifiedFoldersMap = () => {
        return this.modifiedFolders;
    };

    getDeletedFoldersMap = () => {
        return this.deletedFolders;
    };

    
}

/**
 * Holds the information about the file in VS Code. 
 */
export class VSFile {
    private fileName   : string;
    private fileUri    : vscode.Uri;
    private created    : boolean;
    private lines      : number;
    private fileType   : vscode.FileType;


    constructor(fileName : string, fileUri : vscode.Uri, created : boolean,  lines : number, fileType : vscode.FileType) {
        this.fileName = fileName;
        this.fileUri = fileUri;
        this.created = created;
        this.lines = lines;
        this.fileType = fileType;
    }

    getFileName = () : string => {
        return this.fileName;
    };

    printFile = () : void => {
        vscode.window.showInformationMessage(this.fileName + '\n' + this.created + '\n' + this.lines + '\n' + this.fileType);
    };

    getFilePath = () : string => {
        return this.fileUri.fsPath;
    };

    getNumLines = () : number => {
        return this.lines;
    };
};

/**
 * Holds the information about the folder in VS Code. 
 */
export class VSFolder {
    private folderName   : string;
    private folderUri    : vscode.Uri;
    private created      : boolean;
    private fileType     : vscode.FileType;


    constructor(folderName : string, folderUri : vscode.Uri, created : boolean, fileType : vscode.FileType) {
        this.folderName = folderName;
        this.folderUri = folderUri;
        this.created = created;
        this.fileType = fileType;
    }

    getFolderPath = () : string => {
        return this.folderUri.fsPath;
    };
    getFolderName = () : string => {
        return this.folderName;
    };


};