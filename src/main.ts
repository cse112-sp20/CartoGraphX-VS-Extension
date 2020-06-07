/* eslint-disable no-unused-expressions */
import * as firebase from "firebase";
import * as firebaseAdmin from "firebase-admin";
import * as vscode from "vscode";
import {firebaseAuthConfig} from "./authconfig";
import { signIn, signOut, userStatus, signUp} from "./auth";
import { displayCurrentWorkingFile, statusBarItem, createMapFunction } from "./chartgraphx";
import { firebaseConfig } from "./config";
import { currentDocumentListener } from "./events";
import { fetchRemoteGit, findGitFileLines, findGitFiles, findGitRoot, findGitUrl, gitRoot, sendGitData } from "./git";

// Initialize Firebase and Firebase Admin.
firebase.initializeApp(firebaseConfig);
export const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseAuthConfig),
});
export const auth = firebase.auth();


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
    vscode.window.showInformationMessage("CartoGraphX is now active!");
    statusBarItem.show();


    // Undefined or empty string if the user is logged out, string if the user is logged in. 
     const userToken : string | undefined = context.globalState.get("cartoGraphXUser");

     console.log("On activation, cartoGraphXUser is: " + userToken);

    // Logs user in using token if the user has not explicitly signed out. 
    if(userToken !== undefined && userToken !== "") {

        console.log("Good credentials. Loggining in with token.");
        
        // If the user has not explicitly signed off, log them in with their token. 
        auth.signInWithCustomToken(userToken).catch( (error) => {
            vscode.window.showErrorMessage("Error: Something went wrong with loging in with tokens.");
        });
    }

    /** This command displays a quickpick in the IDE window that allows the user to choose between available commands */
    const disposable = vscode.commands.registerCommand("chartGraphX.toolbarAction", async () => {
        if (auth.currentUser !== null) {
            vscode.window.showQuickPick(
                [
                    { label: "Display Current Working File", undefined, target: displayCurrentWorkingFile },
                    { label: "Get user info", undefined, target: userStatus },
                    { label: "Sign out", description: "Stop ChartGraphX tracking", target: signOut },
                    { label: "Create map", descrition: "Create a map", undefined, target: createMapFunction}
                ],
                { placeHolder: "ChartGraphX commands" }
            ).then( (method) => {
                
                // Might cause a bug w/ the different param types.                 
                method?.target(auth, context);
            });
        } else {
            vscode.window.showQuickPick([
                { label: "Sign In", description: "Sign in using email and password", target: signIn },
                { label: "Sign Up", description: "Create a user with email and password", target: signUp }
                ],
                { placeHolder: "Sign in or create a new ChartGraphX user" }
            ).then( (method) => {
                method?.target(auth, context);
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
        //console.log(JSON.stringify(firebaseUser, null, 2));
    });
    
}

/** this method is called when your extension is deactivated */
// tslint:disable-next-line: no-empty
export function deactivate() {}
