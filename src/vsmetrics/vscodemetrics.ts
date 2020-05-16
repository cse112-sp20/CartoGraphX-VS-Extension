/**
 * This file contains the data structures and functions for the metrics we want to send from VS Code to the Firebase Database. 
 */

import * as vscode from 'vscode'

/**
 *  A class that contains the root of the document tree as well as data that
 *  that pertains to the structure of the workspace *(more to come).
 */
class VSCodeMetrics {
    private root: VSFolder; // Contains the doc root of the project. All paths extend from root. 
    private rootName: string; // Contains the name of the root. 

    /**
     * @param root The folder that start of the project. 
     * @param rootName Contains the name of the root. 
     */
    constructor(root: VSFolder, rootName: string) {
        this.root = root;
        this.rootName = rootName;
    }
};

class VSFolder {
    private name: string; // Contains the name of the folder. 
    private folders: VSFolder[] // Contains the other folders inside the current folder. 
    private files: VSFile[]; // Contains the files insdide the folder. 
    private numFolders: number; // Contains the number of folders inside the current folder.
    private numFiles: number; // Contains the number of files inside the folder.

    constructor(name: string) {
        this.name = name;
        this.folders = [];
        this.files = [];
        this.numFolders = 0;
        this.numFiles = 0;
    }

    
};

class VSFile {
    private name: string; // Contains the name of the file. 
    private lines: number; // Contains the number of lines for the file. 
    private hasChanged: boolean; // True when the file has changed since the last update. False otherwise.

    constructor(name:string) {
        this.name = name;
        this.lines = 0;
        this.hasChanged = false;
    }

};


 