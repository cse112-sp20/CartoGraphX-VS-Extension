import * as firebase from "firebase";
import * as vscode from "vscode";
import {admin} from "./main";


/**
 * This function will let the user sign in by providing email and password.
 * This function sets auth.currentUser
 *
 * @param  {firebase.auth.Auth} auth
 * @param {vscode.ExtensionContext} context
 */
export const signIn = async (auth: firebase.auth.Auth, context : vscode.ExtensionContext) => {
    const email = await vscode.window.showInputBox({placeHolder: "email"});
    const password = await vscode.window.showInputBox({placeHolder: "password", password: true}); // 'testPassword'
    auth.signInWithEmailAndPassword(email !== undefined ? email : "", password !== undefined ? password : "")
        // tslint:disable-next-line: max-line-length
        .then(async (res) => {

            // Get the user id from firebase auth. 
            const uid = res.user?.uid !== undefined ? res.user?.uid : "";


            if(uid !== "" && uid !== null) {

                console.log("Made it before createCustomToken. uid = " + uid);
                // Create a custom token and store it in the global VSCode state (persistant login).
                await admin.auth().createCustomToken(uid).then( (customToken) => {
                    context.globalState.update("cartoGraphXUser", customToken);
                    console.log("After sign in, cartoGraphXUser is: " + context.globalState.get("cartoGraphXUser"));
                    vscode.window.showInformationMessage("You are now signed to ChartGraphX as: " + auth.currentUser?.email);
                });
            }
        })
        .catch((error: { code: any; message: any; }) => {
            vscode.window.showWarningMessage(error.message);
        },
    );
};

/**
 * This function will sign the user out.
 * This will make firebase.auth.currentUser == null
 *
 * @param  {firebase.auth.Auth} auth
 */
export const signOut = (auth: firebase.auth.Auth, context : vscode.ExtensionContext) => {
    auth.signOut()
        .then( (res) => {

            // This terminates persistant login.
            context.globalState.update("cartoGraphXUser", "");

            console.log("After sign out, cartoGraphXUser is: " + context.globalState.get("cartoGraphXUser"));

            
            vscode.window.showInformationMessage("You are now signed out of CartoGraphX!");
        })
        .catch((error: { code: string; message: string; }) => {
            vscode.window.showWarningMessage(error.message);
    });
};

/**
 * This function displays the email of the auth.currentUser object in a vscode information window
 *
 * @param  {firebase.auth.Auth} auth
 */
export const userStatus = (auth: firebase.auth.Auth) => {
    const userEmail = auth.currentUser !== null ? auth.currentUser.email : "";
    // tslint:disable-next-line: max-line-length
    vscode.window.showInformationMessage(userEmail !== null ? ("Signed in as: " + userEmail) : "You are not signed in.." );
};

/**
 * This function will let the user sign up by providing email and password.
 * This function sets auth.currentUser
 *
 * @param  {firebase.auth.Auth} auth
 * @param {vscode.ExtensionContext} context
 */
export const signUp = async (auth: firebase.auth.Auth, context : vscode.ExtensionContext) => {
    const email = await vscode.window.showInputBox({placeHolder: "email"});
    const password = await vscode.window.showInputBox({placeHolder: "password", password: true}); // 'testPassword'
    auth.createUserWithEmailAndPassword(email !== undefined ? email : "", password !== undefined ? password : "")
        // tslint:disable-next-line: max-line-length
        .then( (res) => {

            // Get the user id from firebase auth. 
            const uid = res.user?.uid !== undefined ? res.user?.uid : "";


            if(uid !== "" || uid !== null) {
                
                // Create a custom token and store it in the global VSCode state (persistant login).
                admin.auth().createCustomToken(uid).then( (customToken) => {
                    context.globalState.update("cartoGraphXUser", customToken);
                    console.log("After sign up, cartoGraphXUser is: " + context.globalState.get("cartoGraphXUser"));
                    vscode.window.showInformationMessage("The user " + auth.currentUser?.email + " has been created!");
                });
            }

            
        })
        .catch((error: { code: any; message: any; }) => {
            vscode.window.showWarningMessage(error.message);
        },
    );
};
