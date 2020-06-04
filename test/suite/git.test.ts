import * as assert from "assert";
import { findGitFileLines, findGitFiles, findGitRoot, findGitUrl, gitRoot, gitFilesArray, gitUrl, repoName, gitFileLines } from "../../src/git";

/** This test suite tests the types of the exported variables from gitRoot */
suite("testing git.ts", () => {
    
    /** testing if gitRoot is the correct type after running findGitRoot */
    test("assert that gitRoot is valid string", async () => {
        findGitRoot();
        assert.notEqual(undefined, gitRoot);
        assert.equal(typeof "string", typeof gitRoot);
        if (gitRoot.length === 0) {
            assert.equal("", gitRoot);
        }
    });

    /** testing if gitFilesArray is the correct type after running findGitFiles */
    test("assert that gitFilesArray is valid array", async () => {
        findGitFiles();
        assert.notEqual(undefined, gitFilesArray);
        assert.equal(true, Array.isArray(gitFilesArray));
    });

    /** testing if gitUrl is the correct type after running findGitUrl */
    test("assert that gitUrl is valid string", async () => {
        findGitUrl();
        assert.notEqual(undefined, gitUrl);
        assert.equal(typeof "string", typeof gitUrl);
        if (gitUrl.length === 0) {
            assert.equal("", gitUrl);
        }
    });

    /** testing if repoName is the correct type after running findGitUrl */
    test("assert that repoName is valid string", async () => {
        findGitUrl();
        assert.notEqual(undefined, repoName);
        assert.equal(typeof "string", typeof repoName);
        if (repoName.length === 0) {
            assert.equal("", repoName);
        }
    });

    /** testing if gitFileLines is the correct type after running findGitFileLines */
    test("testing findGitFileLines", async () => {
        findGitFileLines();
        assert.notEqual(undefined, gitFileLines);
        assert.equal("object", typeof gitFileLines);
    });

});
