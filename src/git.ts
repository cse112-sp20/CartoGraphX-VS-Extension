import * as vscode from 'vscode';
import * as simpleGit from "simple-git/promise";

// Set the global variable gitRoot to the root of the Git repository
export let gitRoot : string = "";
export let gitFilesArray : string[] = [];
export let gitUrl : string = "";
export let repoName : string = "";
export let vscodeRoot :string | undefined = vscode.workspace.rootPath;
export let git : any = simpleGit(vscodeRoot);


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
 * This function gets an array of all the files in the remote master branch.
 */
export async function findGitFiles() {
    let gitFiles = await git.raw(['ls-tree', '-r', 'origin/master', '--full-tree', '--name-status']);
    gitFilesArray = gitFiles.split('\n');
    gitFilesArray.pop(); // Removes the last empty element from the array created from splitting on \n
    console.log(gitFilesArray);
}


/**
 * This function gets the url of the remote git repository.
 */
export async function findGitUrl() {
    gitUrl = await git.raw(['config', '--get', 'remote.origin.url']);
    gitUrl = gitUrl.split('\n')[0];
    repoName = gitUrl.split('.git')[0].split('/').slice(-1)[0];
    console.log(gitUrl);
    console.log(repoName);
}
