import * as vscode from 'vscode';
import {displayCurrentWorkingFile, statusBarItem} from './chartgraphx';
import * as firebase from 'firebase';
import { signIn, signOut, userStatus, signUp} from './auth'; 
import { firebaseConfig} from './config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


export function activate(context: vscode.ExtensionContext) {
	console.log('ChartGraphX is now active!');
	statusBarItem.show();

	let disposable = vscode.commands.registerCommand('chartGraphX.toolbarAction', async () => {
		// shows quickpick with available commands depending on user is signed in or not
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

	// runs each time auth changes (login/logout)
	auth.onAuthStateChanged(firebaseUser => {
		if (firebaseUser === null) {statusBarItem.color = "darkgrey";}
		else {statusBarItem.color = 'white';}
		console.log(JSON.stringify(firebaseUser,null,2));
	});
	
	context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {}








/*
	// authentication commands
	let signin = vscode.commands.registerCommand('chartGraphX.signIn', () => signIn(auth));
	let signout = vscode.commands.registerCommand('chartGraphX.signOut', () => signOut(auth));
	let checkAuthState = vscode.commands.registerCommand('chartGraphX.checkAuthState', () => console.log(auth.currentUser));
*/ 