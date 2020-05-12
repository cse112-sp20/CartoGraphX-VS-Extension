import * as firebase from 'firebase';
import * as vscode from 'vscode';


export const firebaseConfig = {
    // place the config for your firebase application here
    apiKey: "AIzaSyBoCc3PDlf5vQVgAS9iNlfoa8fMvbN-amY",
    authDomain: "cgphx-56959.firebaseapp.com",
    databaseURL: "https://cgphx-56959.firebaseio.com",
    projectId: "cgphx-56959",
    storageBucket: "cgphx-56959.appspot.com",
    messagingSenderId: "962297814867",
    appId: "1:962297814867:web:b4bd44e9ac216233f98ba6",
    measurementId: "G-5VZCQLPBM4"
};

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
