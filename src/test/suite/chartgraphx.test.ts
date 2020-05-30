import * as assert from "assert";
import * as firebase from "firebase";
import * as vscode from "vscode";
import { firebaseConfig } from "../../config";
import { createMapFunction, currentMap } from "../../chartgraphx";

suite("testing chartgraphx.ts", () => {
    //vscode.window.showInformationMessage("Start sample test");
    test("assert that curFile is valid string", async () => {
        createMapFunction();
        assert.notEqual(undefined, currentMap);
        assert.equal(typeof "string", typeof currentMap);
        console.log(currentMap);
        if (currentMap.length === 0) {
            assert.equal("", currentMap);
        }
    });

});
