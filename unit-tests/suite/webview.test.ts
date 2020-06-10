import * as assert from "assert";
import { panel, generateWebview } from "../../src/webview";

/** This test suite tests the functions from webview.ts*/
suite("type testing for chartgraphx.ts", () => {

    /** testing if webview successfully creates a panel */
    test("assert that creating a webview updates the panel variable", async () => {
        assert.equal(panel, undefined);
        let ret : any = await generateWebview("fakeMapKeyString");
        assert.notEqual(panel, undefined);
        if (typeof ret === "string") {
            console.log("lol");
            assert.notEqual(ret.length, 0);
        }
    });

});
