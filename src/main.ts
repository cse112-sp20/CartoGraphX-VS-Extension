/* eslint-disable no-unused-expressions */
import * as firebase from "firebase";
import * as vscode from "vscode";
import { signIn, signOut, userStatus} from "./auth";
import {displayCurrentWorkingFile, statusBarItem} from "./chartgraphx";
import { firebaseConfig} from "./config";
import * as simpleGit from "simple-git/promise";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


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
async function findGitRoot() {
    try {
        gitRoot = await git.revparse(['--show-toplevel']);
    } catch(err) {
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
async function findGitFiles() {
    let gitFiles = await git.raw(['ls-tree', '-r', 'origin/master', '--full-tree', '--name-status']);
    gitFilesArray = gitFiles.split('\n');
    gitFilesArray.pop(); // Removes the last empty element from the array created from splitting on \n
    console.log(gitFilesArray);
}


/**
 * This function gets the url of the remote git repository.
 */
async function findGitUrl() {
    gitUrl = await git.raw(['config', '--get', 'remote.origin.url']);
    gitUrl = gitUrl.split('\n')[0];
    repoName = gitUrl.split('.git')[0].split('/').slice(-1)[0];
    console.log(gitUrl);
    console.log(repoName);
}


findGitRoot();
findGitFiles();
findGitUrl();

/**
 * This function is called when the extension is activated
 *
 * @param  {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage("ChartGraphX is now active!");
    statusBarItem.show();

    /** This command displays a quickpick in the IDE window that allows the user to choose between available commands */
    const disposable = vscode.commands.registerCommand("chartGraphX.toolbarAction", async () => {
        if (auth.currentUser !== null) {
            vscode.window.showQuickPick(
                [
                    { label: "Sign out", description: "Stop ChartGraphX tracking", target: signOut },
                    { label: "Get user info", undefined, target: userStatus },
                    { label: "Display Current Working File", undefined, target: displayCurrentWorkingFile }
                ],
                { placeHolder: "ChartGraphX commands" }
            ).then( (method) => {
                method?.target(auth);
            });
        } else {
            vscode.window.showQuickPick(
                [{ label: "Email", description: "Sign in using email and password", target: signIn }],
                { placeHolder: "Select a signin method" }
            ).then( (method) => {
                method?.target(auth);
            });
        }
    });

    /** Adds an observer for changes to the user's sign-in state. (login/logout) */ 
    auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser === null) {statusBarItem.color = "darkgrey";
        } else {statusBarItem.color = "white";
        }
        console.log(JSON.stringify(firebaseUser, null, 2));
    });
    context.subscriptions.push(disposable);
}

/** this method is called when your extension is deactivated */
// tslint:disable-next-line: no-empty
export function deactivate() {}
