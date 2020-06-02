/* eslint-disable no-unused-expressions */
import * as firebase from "firebase";
import * as vscode from "vscode";
import { signIn, signOut, userStatus, signUp} from "./auth";
import { displayCurrentWorkingFile, statusBarItem, createMapFunction, loadMapFunction } from "./cartographx";
import { firebaseConfig } from "./config";
import { currentDocumentListener } from "./events";
import { fetchRemoteGit, findGitFileLines, findGitFiles, findGitRoot, findGitUrl, gitRoot, sendGitData } from "./git";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();


/**
 * This function is called when the extension is activated
 *
 * @param  {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
    findGitRoot();
    fetchRemoteGit();
    findGitFiles();
    findGitUrl();
    findGitFileLines();

    vscode.window.showInformationMessage("ChartGraphX is now active!");
    statusBarItem.show();

    /** This command displays a quickpick in the IDE window that allows the user to choose between available commands */
    const disposable = vscode.commands.registerCommand("chartGraphX.toolbarAction", async () => {
        if (auth.currentUser !== null) {
            vscode.window.showQuickPick(
                [
                    { label: "Display Current Working File", undefined, target: displayCurrentWorkingFile },
                    { label: "Get user info", undefined, target: userStatus },
                    { label: "Sign out", description: "Stop ChartGraphX tracking", target: signOut },
                    { label: "Create map", descrition: "Create a map", undefined, target: createMapFunction},
                    { label: "Load map", description: "Load a map", undefined, target: loadMapFunction}
                ],
                { placeHolder: "ChartGraphX commands" }
            ).then( (method) => {
                method?.target(auth);
            });
        } else {
            vscode.window.showQuickPick([
                { label: "Sign In", description: "Sign in using email and password", target: signIn },
                { label: "Sign Up", description: "Create a user with email and password", target: signUp }
                ],
                { placeHolder: "Sign in or create a new ChartGraphX user" }
            ).then( (method) => {
                method?.target(auth);
            });
        }
    });
    context.subscriptions.push(disposable);


    /** Adds an event listener for changes to the user's sign-in state. (login/logout) */ 
    auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser === null) {
            statusBarItem.color = "darkgrey";
        } else {
            if (gitRoot !== "") {
                statusBarItem.color = "white";
                // let token = auth.currentUser?.getIdToken();
                // if (token) {
                //     token.then(value => {
                //         sendGitData(value);
                //     });
                //     token.catch(error => {
                //         vscode.window.showErrorMessage('Error: Unable to communicate with server!');
                //     });
                // }
                currentDocumentListener();

            } else {
                statusBarItem.color = "darkgrey";
                vscode.window.showErrorMessage("Not currently in a Git repository!");
            }
        }
        console.log(JSON.stringify(firebaseUser, null, 2));
    });
    
}

/** this method is called when your extension is deactivated */
// tslint:disable-next-line: no-empty
export function deactivate() {}
