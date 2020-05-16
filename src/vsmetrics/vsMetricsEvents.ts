import * as vscode from 'vscode';

let FILE_NAME_INDEX = -1;

let fileChanges : FileChange[] = []

function changeTextDocumentListener() {
    vscode.workspace.onDidChangeTextDocument((textDocChangeEvent : vscode.TextDocumentChangeEvent) => {
        let document     : vscode.TextDocument = textDocChangeEvent.document;
        let documentName : string              = document.fileName;
        let documentURI  : vscode.Uri          = document.uri;
    
        // If our document is already queued for changes in fileChanges, then remove the old and just add the new one.
        // If the file is not already queued for an update, then only add a new FileChange.
    });
}

function createFilesListener(){
    vscode.workspace.onDidCreateFiles((fileCreateEvent) => {
        let filesCreated = fileCreateEvent.files;
    
        filesCreated.forEach((fileUri) => {
            let fileUriSplit : string[]        = fileUri.toString().split("/");
            let fileName     : string          = fileUriSplit[-1];
            let fileType     : vscode.FileType = vscode.FileType.File; // Default to file.
    
            vscode.workspace.fs.stat(fileUri).then((fileStat) => {
                fileType = fileStat.type;
            })
    
            fileChanges.push(new FileChange(fileName, fileUri, true, fileType));
        })
    });
}

function deleteFilesListener(){
    vscode.workspace.onDidDeleteFiles((fileDeleteEvent) => {

    });
}

function updateFirebaseOnInterval(interval : number){
    // Do Firebase magic on queued FileChanges every "interval" miliseconds.
}


function initializeMetricListeners(){
    changeTextDocumentListener();
    createFilesListener();
    deleteFilesListener();
}

class FileChange {
    private fileName   : string;
    private fileUri    : vscode.Uri;
    private created    : boolean;
    private fileType   : vscode.FileType;


    constructor(fileName : string, fileUri : vscode.Uri, created : boolean, fileType : vscode.FileType) {
        this.fileName = fileName;
        this.fileUri = fileUri;
        this.created = created;
        this.fileType = fileType;
    }
};