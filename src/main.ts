<<<<<<< HEAD
/* eslint-disable no-unused-expressions */
import * as firebase from "firebase";
import * as vscode from "vscode";
import { signIn, signOut, userStatus} from "./auth";
import {displayCurrentWorkingFile, statusBarItem} from "./chartgraphx";
import { firebaseConfig} from "./config";
=======
import * as vscode from 'vscode';
import {displayCurrentWorkingFile, statusBarItem} from './chartgraphx';
import * as firebase from 'firebase';
import { signIn, signOut, userStatus, signUp} from './auth'; 
import { firebaseConfig} from './config';
import {VSMetrics} from './vsmetrics/vscodemetrics';
import {sendClientData} from './vsmetrics/sendmetrics';
import {createFileListener} from './vsmetrics/metricevents';
>>>>>>> 4e99e3189df9c03c9c31bb854fa090fcc5fb3fc8

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

<<<<<<< HEAD
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
=======
// Contains the list of documents for the user. 
export let docs : VSMetrics = new VSMetrics();

// Contains the user info.
export let user : any =  {
	"email" : ""
};

/**
 * This function is called when the extension is activated
 * 
 * @param  {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('ChartGraphX is now active!');
	statusBarItem.show();


	/** This command displays a quickpick in the IDE window that allows the user to choose between available commands */
	let disposable = vscode.commands.registerCommand('chartGraphX.toolbarAction', async () => {
		if (auth.currentUser !== null){
			vscode.window.showQuickPick(
				[
					{ label: 'Sign out', description: 'Stop ChartGraphX tracking', target: signOut },
					{ label: 'Get user info', undefined, target: userStatus },
					{ label: 'Display Current Working File', undefined, target: displayCurrentWorkingFile }
				],
				{ placeHolder: 'ChartGraphX commands' }
			).then( method =>{
				method?.target(auth);
			});
		}
		else{
			vscode.window.showQuickPick(
				[{label: 'Register', description: 'Create a new account using email and password', target: signUp }, { label: 'Email', description: 'Sign in using email and password', target: signIn }],
				{ placeHolder: 'Select a signin method' }
			).then( method =>{
				method?.target(auth);
			});
		}	
	});

	/** Adds an observer for changes to the user's sign-in state. (login/logout) */ 
	auth.onAuthStateChanged(firebaseUser => {
		if (firebaseUser === null) {statusBarItem.color = "darkgrey";}
		else {statusBarItem.color = 'white';}
		console.log(JSON.stringify(firebaseUser,null,2));
	});
	
	context.subscriptions.push(disposable);

	// function send () {
	// 	sendClientData;
	// }


	createFileListener();

}
>>>>>>> 4e99e3189df9c03c9c31bb854fa090fcc5fb3fc8

    /** Adds an observer for changes to the user's sign-in state. (login/logout) */ 
    auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser === null) {statusBarItem.color = "darkgrey";
        } else {statusBarItem.color = "white";
        }
        console.log(JSON.stringify(firebaseUser, null, 2));
    });
    context.subscriptions.push(disposable);
}

<<<<<<< HEAD
/** this method is called when your extension is deactivated */
// tslint:disable-next-line: no-empty
export function deactivate() {}
=======


/** this method is called when your extension is deactivated */ 
export function deactivate() {}
>>>>>>> 4e99e3189df9c03c9c31bb854fa090fcc5fb3fc8
