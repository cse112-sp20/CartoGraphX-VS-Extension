import * as vscode from 'vscode';
import {displayCurrentWorkingFile, statusBarItem} from './chartgraphx';
import * as firebase from 'firebase';
import { signIn, signOut, userStatus, signUp} from './auth'; 
import { firebaseConfig} from './config';
import {VSCodeMetrics} from './vsmetrics/vscodemetrics'
import {VSFolder} from './vsmetrics/vscodemetrics'
import {VSFile} from './vsmetrics/vscodemetrics'

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

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
}

let name = vscode.workspace.name;
//let folders = vscode.workspace.getWorkspaceFolder();
let folders = new VSFolder("\ChartGraphX-VS-code-extension-MVP");
let docTree = new VSCodeMetrics(folders, "\ChartGraphX-VS-code-extension-MVP");


/** this method is called when your extension is deactivated */ 
export function deactivate() {}