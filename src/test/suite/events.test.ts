import * as assert from "assert";
import * as firebase from "firebase";
import * as vscode from "vscode";
import { firebaseConfig } from "../../config";
import { currentDocumentListener, curFile } from "../../events";

suite("testing events.ts", () => {
    //vscode.window.showInformationMessage("Start sample test");
    test("assert that curFile is valid string", async () => {
        currentDocumentListener();
        assert.notEqual(undefined, curFile);
        assert.equal(typeof "string", typeof curFile);
        console.log(curFile);
        if (curFile.length === 0) {
            assert.equal("", curFile);
        }
    });

});
