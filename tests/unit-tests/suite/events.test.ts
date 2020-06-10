import * as assert from "assert";
import { currentDocumentListener, curFile } from "../../../src/events";

/** This test suite tests the types of the exported variables from events */
suite("testing events.ts", () => {
    /** testing if curFile is the correct type after running currentDocumentListener */
    test("assert that curFile is valid string", async () => {
        currentDocumentListener();
        assert.notEqual(undefined, curFile);
        assert.equal(typeof "string", typeof curFile);
        if (curFile.length === 0) {
            assert.equal("", curFile);
        }
    });

});
