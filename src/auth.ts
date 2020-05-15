import * as firebase from 'firebase';
import * as vscode from 'vscode';


export const signIn = async (auth: firebase.auth.Auth) => {
    console.log('signing in...');
    const email = await vscode.window.showInputBox({placeHolder: 'email'});
    const password = await vscode.window.showInputBox({placeHolder: 'password', password: true}); // 'testPassword'
    auth.signInWithEmailAndPassword(email !== undefined ? email: '', password !== undefined ? password: '') 
        .then( res => vscode.window.showInformationMessage('You are now signed to ChartGraphX as: '+auth.currentUser?.email))
        .catch(function(error: { code: any; message: any; }) {
            vscode.window.showWarningMessage(error.message);
        }
    );
};

export const signOut = (auth: firebase.auth.Auth) => {
    console.log('signing out...');
    auth.signOut()
        .then( res => vscode.window.showInformationMessage('You are now signed out of ChartGraphX!'))
        .catch(function(error: { code: string; message: string; }) {
            vscode.window.showWarningMessage(error.message);
    });
};

export const userStatus = (auth: firebase.auth.Auth) => {
    const userEmail = auth.currentUser !== null ? auth.currentUser.email: ''; 
    vscode.window.showInformationMessage(userEmail !== null? ('Signed in as: '+userEmail): 'You are not signed in..' );
};

export const signUp = async (auth: firebase.auth.Auth) => {
    console.log('creating account...');
    const email = await vscode.window.showInputBox({placeHolder: 'email'});
    const password = await vscode.window.showInputBox({placeHolder: 'password', password: true}); // 'testPassword'
    auth.createUserWithEmailAndPassword(email !== undefined ? email: '', password !== undefined ? password: '') 
        .then( res => vscode.window.showInformationMessage('The user '+auth.currentUser?.email + " has been created!"))
        .catch(function(error: { code: any; message: any; }) {
            vscode.window.showWarningMessage(error.message);
        }
    );
};
