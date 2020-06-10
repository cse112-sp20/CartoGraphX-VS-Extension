import * as assert from "assert";
import * as vscode from "vscode";
import { sendCurrentFile, currentDocumentListener, curFile } from "../../src/events";


/** This test suite tests the types of the exported variables from events */
suite("testing events.ts", () => {

    /** test if sendCurrentFile returns correctly */
    test("assert that sendCurrentFile fails properly", async() => {
        let ret : any = await sendCurrentFile("fakeToken", "fakeFile");
        assert.equal(ret, undefined);
    });

    /** testing if curFile is the correct type after running currentDocumentListener */
    test("assert that curFile is valid string", async () => {
        let ret : string = await currentDocumentListener();
        assert.notEqual(undefined, curFile);
        assert.equal(typeof "string", typeof curFile);
        assert.equal(typeof ret, typeof "string");
        if (curFile.length === 0) {
            assert.equal("", curFile);
        }
    });

});
