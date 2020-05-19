import * as vscode from 'vscode';
import {displayCurrentWorkingFile, statusBarItem} from './chartgraphx';
import * as firebase from 'firebase';
import { signIn, signOut, userStatus, signUp} from './auth'; 
import { firebaseConfig} from './config';
import {VSMetrics, VSFile} from './vsmetrics/vscodemetrics';
import {sendData} from './vsmetrics/sendmetrics';
import {listen} from './vsmetrics/metricevents';
import { XMLHttpRequest } from 'xmlhttprequest-ts';
import { findGitRoot, findGitFiles, findGitUrl } from './git';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

findGitRoot();
findGitFiles();
findGitUrl();

// Contains the list of documents for the user. 
export let docs : VSMetrics = new VSMetrics();

// Define the number of minutes it takes to update. 
const numMin = 1;

// Send the client data every numMin minutes.
let clientDataTimeout : NodeJS.Timeout;


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
		if (firebaseUser === null) {
			statusBarItem.color = "darkgrey";
			clearInterval(clientDataTimeout);
		}
		
		else {
			statusBarItem.color = 'white';

			// Listen for file changes. 
			listen();

			// Sets the interval to get the client data. 
			clientDataTimeout = setInterval(sendData, 60000 * numMin);
	
		}

		console.log(JSON.stringify(firebaseUser,null,2));
	});
	
	context.subscriptions.push(disposable);
	

}

/** this method is called when your extension is deactivated */ 
export function deactivate() {}
