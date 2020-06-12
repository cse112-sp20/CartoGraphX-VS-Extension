import * as assert from "assert";
import * as git from "../../src/git";

/** This test suite tests the types of the exported variables from gitRoot */
suite("testing git.ts", () => {
    
    /** testing if gitRoot is the correct type after running findGitRoot */
    test("assert that gitRoot is valid string", async () => {
        let ret : string;
        ret = await git.findGitRoot();
        assert.notEqual(undefined, git.gitRoot);
        assert.equal(typeof "string", typeof git.gitRoot);
        assert.equal(git.gitRoot, ret);
        if (git.gitRoot.length === 0) {
            assert.equal("", git.gitRoot);
        }
    });

    /** testing that gitFetch returns correctly */
    test("assert that gitFetch is valid string", async() => {
        let ret : string;
        assert.notEqual(undefined, git.gitFetch);
        ret = await git.fetchRemoteGit();
        assert.equal(git.gitFetch, ret);
    });

    /** testing if gitFilesArray is the correct type after running findGitFiles */
    test("assert that gitFilesArray is valid array", async () => {
        let ret : string [];
        ret = await git.findGitFiles();
        assert.notEqual(undefined, git.gitFilesArray);
        assert.equal(git.gitFilesArray.length, ret.length);
    });

    /** testing if gitUrl is the correct type after running findGitUrl */
    test("assert that gitUrl is valid string", async () => {
        let ret : string;
        ret = await git.findGitUrl();
        assert.notEqual(undefined, git.gitUrl);
        assert.equal(typeof "string", typeof git.gitUrl);
        if (git.gitUrl.length === 0) {
            assert.equal("", git.gitUrl);
        }
        assert.equal(git.gitUrl, ret);
    });

    /** testing if repoName is the correct type after running findGitUrl */
    test("assert that repoName is valid string", async () => {
        await git.findGitUrl();
        assert.notEqual(undefined, git.repoName);
        assert.equal(typeof "string", typeof git.repoName);
        if (git.repoName.length === 0) {
            assert.equal("", git.repoName);
        }
    });

    /** testing if gitFileLines is the correct type after running findGitFileLines */
    test("testing findGitFileLines", async () => {
        let ret : string;
        ret = await git.findGitFileLines();
        assert.notEqual(undefined, git.gitFileLines);
        assert.equal("object", typeof git.gitFileLines);
        assert.equal(git.gitFileLines, ret);
    });

    /** test sendGitData to the backend. This should fail because of an invalid token */
    test("Testing sendGitData failure", async() => {
        let ret : any = await git.sendGitData("badToken");
        assert.equal(undefined, ret);
    });

    /** test if mapId setter works properly */
    test("testing setMapID function", async() => {
        assert.equal("", git.mapId);
        git.setMapID("mapIdSample");
        assert.equal("mapIdSample", git.mapId);
        git.setMapID("m-132t91jhy2ihjuojdm][rt");
        assert.equal("m-132t91jhy2ihjuojdm][rt", git.mapId);
    });

});
