import * as assert from "assert";
import * as vscode from "vscode";
import { displayCurrentWorkingFile, createMapFunction, loadMapFunction, currentMap } from "../../src/commands";

/** This test suite tests the types of the exported variables from chartgraphx */
suite("type testing for commands.ts", () => {

    /** test if the display current working file returns correctly */
    test("assert that the displayCurrentWorkingFile function returns correctly", async() => {
        let ret : string[] = await displayCurrentWorkingFile();
        assert.equal(typeof ret, typeof ["lol"]);
    });

    /** testing if currentMap is the correct type after running createMapFunction */
    test("assert that createMap returns properly", async () => {
        createMapFunction();
        assert.notEqual(undefined, currentMap);
        assert.equal(typeof "string", typeof currentMap);
        if (currentMap.length === 0) {
            assert.equal("", currentMap);
        }
    });
});
