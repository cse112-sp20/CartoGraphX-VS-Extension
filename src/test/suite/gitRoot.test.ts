import * as assert from "assert";
import * as firebase from "firebase";
import * as vscode from "vscode";
import { firebaseConfig } from "../../config";
import * as simpleGit from "simple-git/promise";

/** This test suite uses the provided firebaseConfig and tests signIn and signOut functions. */
suite("testing gitRoot", () => {

    // Set the global variable gitRoot to the root of the Git repository
    let gitRoot : string = "";
    let vscodeRoot :string | undefined = vscode.workspace.rootPath;
    let git : any = simpleGit(vscodeRoot);


    test("if vscode rootpath exists, a git repository should be able to be found", async () => {
        if (vscodeRoot === undefined) {
            assert.notEqual(git, undefined);
            try {
                gitRoot = await git.revparse(['--show-toplevel']);
            } catch(err) {
                assert.notEqual(err, null);
            }
        }
        else {
            assert.notEqual(git, undefined);
            try {  
                gitRoot = await git.revparse(['--show-toplevel']);
            } catch(err) {
                // If the current folder is not part of a Git repository, set empty string
                gitRoot = "";
            }
            assert.notEqual(gitRoot, null);
        }
    });

});
