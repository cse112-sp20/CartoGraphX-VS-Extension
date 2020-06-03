import * as assert from "assert";
import { createMapFunction, currentMap } from "../../cartographx";

/** This test suite tests the types of the exported variables from chartgraphx */
suite("type testing for chartgraphx.ts", () => {
    /** testing if currentMap is the correct type after running createMapFunction */
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
