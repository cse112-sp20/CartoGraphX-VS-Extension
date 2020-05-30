import * as assert from "assert";
import * as vscode from "vscode";
import { fetchRemoteGit, findGitFileLines, findGitFiles, findGitRoot, findGitUrl, gitRoot, gitFilesArray, gitUrl, repoName, gitFileLines, vscodeRoot } from "../../git";

suite("testing gitRoot.ts", () => {
    //vscode.window.showInformationMessage("Start sample test");
    /*test("assert vscodeRoot isn't undefined", async () => {
        assert.notEqual(undefined, vscodeRoot);
    });*/
    
    test("assert that gitRoot is valid string", async () => {
        findGitRoot();
        assert.notEqual(undefined, gitRoot);
        assert.equal(typeof "string", typeof gitRoot);
        if (gitRoot.length === 0) {
            assert.equal("", gitRoot);
        }
    });

    test("assert that gitFilesArray is valid array", async () => {
        findGitFiles();
        assert.notEqual(undefined, gitFilesArray);
        assert.equal(true, Array.isArray(gitFilesArray));
    });

    test("assert that gitUrl is valid string", async () => {
        findGitUrl();
        assert.notEqual(undefined, gitUrl);
        assert.equal(typeof "string", typeof gitUrl);
        if (gitUrl.length === 0) {
            assert.equal("", gitUrl);
        }
    });

    test("assert that repoName is valid string", async () => {
        findGitUrl();
        assert.notEqual(undefined, repoName);
        assert.equal(typeof "string", typeof repoName);
        if (repoName.length === 0) {
            assert.equal("", repoName);
        }
    });

    test("testing findGitFileLines", async () => {
        findGitFileLines();
        assert.notEqual(undefined, gitFileLines);
        assert.equal("object", typeof gitFileLines);
    });

});
