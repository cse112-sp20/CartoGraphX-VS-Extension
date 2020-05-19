/* eslint-disable no-unused-expressions */
import * as firebase from "firebase";
import * as vscode from "vscode";
import { signIn, signOut, userStatus} from "./auth";
import {displayCurrentWorkingFile, statusBarItem} from "./chartgraphx";
import { firebaseConfig} from "./config";
import * as simpleGit from "simple-git/promise";
import { findGitRoot, findGitFiles, findGitUrl, fetchRemoteGit, findGitFileLines, sendGitData } from './git';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

findGitRoot();
fetchRemoteGit();
findGitFiles();
findGitUrl();
findGitFileLines();


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
        if (firebaseUser === null) {
            statusBarItem.color = "darkgrey";
        } else {
            statusBarItem.color = "white";
            let token = auth.currentUser?.getIdToken();
            if (token) {
                token.then(value => {
                    console.log(value);
                    sendGitData(value);
                });
                token.catch(error => {
                    vscode.window.showErrorMessage('Error: Unable to send data to server!');
                });
            }
        }
        //console.log(JSON.stringify(firebaseUser, null, 2));
    });
    context.subscriptions.push(disposable);
}

/** this method is called when your extension is deactivated */
// tslint:disable-next-line: no-empty
export function deactivate() {}
