import * as vscode from 'vscode';
import * as simpleGit from 'simple-git/promise';
import { XMLHttpRequest } from 'xmlhttprequest-ts';
import { currentMap } from './chartgraphx';
import { generateWebview } from './webview';

// Set the global variable gitRoot to the root of the Git repository
export let gitRoot : string = "";
export let gitFilesArray : string[] = [];
export let gitUrl : string = "";
export let repoName : string = "";
export let gitFileLines : any = {};
export let vscodeRoot :string | undefined = vscode.workspace.rootPath;
export let git : any = simpleGit(vscodeRoot);
export let mapId : string = "";


/**
 * This function finds the Git root if the folder open in vscode is in a Git repository.
 */
export async function findGitRoot() {
    try {
        gitRoot = await git.revparse(['--show-toplevel']);
    } catch(err) {
        // Display an error message and sets gitRoot to an empty string if not in a Git repository
        vscode.window.showErrorMessage('Error: The current root folder is not in a Git repository!');
        gitRoot = "";
    }
    if (gitRoot !== "") {
        vscode.window.showInformationMessage('The Git root directory is "' + gitRoot + '".');
    }
}


/**
 * This function performs a git fetch on the current repository.
 */
export async function fetchRemoteGit() {
    let gitfetch = await git.fetch('origin', 'master');
    //console.log(gitfetch);
}


/**
 * This function gets an array of all the files in the remote master branch.
 */
export async function findGitFiles() {
    let gitFiles = await git.raw(['ls-tree', '-r', 'origin/master', '--full-tree', '--name-status']);
    gitFilesArray = gitFiles.split('\n');
    gitFilesArray.pop(); // Removes the last empty element from the array created from splitting on \n
    //console.log(gitFilesArray);
}


/**
 * This function gets the url of the remote git repository.
 */
export async function findGitUrl() {
    gitUrl = await git.raw(['config', '--get', 'remote.origin.url']);
    gitUrl = gitUrl.split('\n')[0];
    repoName = gitUrl.split('.git')[0].split('/').slice(-1)[0];
    //console.log(gitUrl);
    //console.log(repoName);
}

/**
 * This function gets the line numbers of each file in the remote master branch.
 */
export async function findGitFileLines() {
    // git hash-object -t tree /dev/null
    let emptyTreeHash = await git.raw(['hash-object', '-t', 'tree', '/dev/null']);
    emptyTreeHash = emptyTreeHash.split('\n')[0];
    // git diff --stat <empty_tree_hash> origin/master
    let gitLines = await git.raw(['diff', '--stat', emptyTreeHash, 'origin/master']);
    gitLines = gitLines.split('\n');
    gitLines.pop();
    gitLines.pop();
    for (let i = 0; i < gitLines.length; i++) {
        let curLine = gitLines[i].split('|'); 
        let key : string = curLine[0].trim();
        let val : string= curLine[1].split('+')[0].trim();
        if (val.includes('bytes')) {
            val = val.split('>')[1].trim();
        }
        gitFileLines[key] = val;
    }
    //console.log(gitFileLines);
}

/**
 * This function sends the aggregated git data to the backend endpoint.
 * 
 * @param {string} token
 */
export async function sendGitData(token : string) {
    let payload : any = {};
    let response : any = {};
    payload["map_name"] = currentMap;
    payload["github_repo_name"] = repoName;
    payload["github_repo_url"] = gitUrl;
    payload["github_repo_file_trees"] = gitFileLines;
    let req = new XMLHttpRequest();
    req.open('POST', 'https://us-central1-remote-13.cloudfunctions.net/api/map/createMap', true);
    req.setRequestHeader('idToken', token);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                response = JSON.parse(req.responseText);
                vscode.window.showInformationMessage('Your map key is: "' + response["data"] + '"!');
                mapId = response["data"];
                generateWebview(mapId);
            } else {
                console.log("An error has occurred while communicating with the server!");
            }
        }
    };
    console.log(JSON.stringify(payload));
    req.send(JSON.stringify(payload));
}

/**
 * Function to set the map id of the current extension
 * @param {string} id
 */
export function setMapID(id : string) {
    mapId = id;
}
