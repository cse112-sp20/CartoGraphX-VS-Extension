<<<<<<< HEAD
import * as assert from "assert";
import * as firebase from "firebase";
import * as vscode from "vscode";
import { firebaseConfig } from "../../config";

/** This test suite uses the provided firebaseConfig and tests signIn and signOut functions. */
suite("testing auth.ts", () => {
    vscode.window.showInformationMessage("Start authentication tests.");
=======
import * as vscode from 'vscode';
import * as assert from 'assert';
import * as firebase from 'firebase';
import { firebaseConfig } from '../../config';

/** This test suite uses the provided firebaseConfig and tests signIn and signOut functions. */
suite('testing auth.ts', () => {
    vscode.window.showInformationMessage('Start authentication tests.');
>>>>>>> 4e99e3189df9c03c9c31bb854fa090fcc5fb3fc8
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
<<<<<<< HEAD
=======
    
>>>>>>> 4e99e3189df9c03c9c31bb854fa090fcc5fb3fc8
    const testUser = {
        email: "test@mail.com",
        password: "testPassword"
    };

<<<<<<< HEAD
    test("signIn without credentials", async () => {
        // tslint:disable-next-line: no-empty
        await auth.signInWithEmailAndPassword("", "").catch((error: { code: any; message: any; }) => {});
        assert.equal(null, auth.currentUser);
    });

    test("signIn and signOut with credentials", async () => {
        // tslint:disable-next-line: no-empty
=======
    test('signIn without credentials', async () => {
        await auth.signInWithEmailAndPassword("","").catch((error: { code: any; message: any; }) => {});
        assert.equal(null, auth.currentUser);
    });
  
    test('signIn and signOut with credentials', async () => {
>>>>>>> 4e99e3189df9c03c9c31bb854fa090fcc5fb3fc8
        await auth.signInWithEmailAndPassword(testUser.email, testUser.password).catch((error: { code: any; message: any; }) => {});
        assert.equal(testUser.email, auth.currentUser?.email);
        await auth.signOut();
        assert.equal(null, auth.currentUser);
    });
<<<<<<< HEAD

});
=======
  
});
>>>>>>> 4e99e3189df9c03c9c31bb854fa090fcc5fb3fc8
