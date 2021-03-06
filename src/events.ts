import * as vscode from "vscode";
import { repoName, gitUrl, gitRoot, mapId } from "./git";
import { auth } from "./main";
import { XMLHttpRequest } from "xmlhttprequest-ts";

export let curFile : string = "";

/**
 * This function sends the current file that the user has open to the backend endpoint.
 * 
 * @param token the id token of the user
 * @param file the current file that the user has open
 */
export async function sendCurrentFile(token : string, file : string) {
    let payload : any = {};
    payload["github_repo_name"] = repoName;
    payload["github_repo_url"] = gitUrl;
    payload["map_key"] = mapId;
    payload["filepath"] = file;
    let req = new XMLHttpRequest();
    req.open('POST', 'https://us-central1-remote-13.cloudfunctions.net/api/map/currentEdit', true);
    req.setRequestHeader('idToken', token);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE) {
            return payload;
        }
    };
    req.send(JSON.stringify(payload));
}

/**
 * This function listens for any changes in the text editor and gets the current file open.
 */
export async function currentDocumentListener() {
    /** Adds an event listener for changes to the user's current editing file. */
    vscode.window.onDidChangeActiveTextEditor((openEditor : vscode.TextEditor | undefined) => {
        if (openEditor !== undefined && gitRoot !== "") {
            curFile = openEditor.document.uri.path.split(vscode.Uri.file(gitRoot).path + '/')[1];
        }
        else if (openEditor === undefined) {
            curFile = "";
        }
        if (curFile !== "") {
            let token = auth.currentUser?.getIdToken();
            if (token) {
                token.then(value => {
                    sendCurrentFile(value, curFile);
                });
                token.catch(error => {
                    vscode.window.showErrorMessage('Error: Unable to communicate with server!');
                });
            } 
        }
    });
    return curFile;
}
