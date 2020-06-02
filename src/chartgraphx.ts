import * as vscode from "vscode";
import { sendGitData } from "./git";
import { auth } from "./main";

export let currentMap : string = "";

/**
 * TESTING purposes 
 */
export const  displayCurrentWorkingFile = () => {

    const rootPath = (vscode.workspace.rootPath !== undefined) ? vscode.workspace.rootPath : "";
    const openFileName = vscode.window.visibleTextEditors.map((e) => e.document.fileName.replace(rootPath, ""));
    const openFileLineCount = vscode.window.visibleTextEditors.map((e) => e.document.lineCount);
    // tslint:disable-next-line: max-line-length
    vscode.window.showInformationMessage("Currently in file: " + openFileName + "\n\nLines in file: " + openFileLineCount, { modal: true });
};

export async function createMapFunction() {
    const mapname = await vscode.window.showInputBox({placeHolder: "map name"});
    if (mapname !== "" && mapname !== undefined) {
        currentMap = mapname;
        let token = auth.currentUser?.getIdToken();
        if (token) {
            token.then(value => {
                sendGitData(value);
            });
            token.catch(error => {
                vscode.window.showErrorMessage('Error: Unable to communicate with server!');
            });
        }
    } else {
        vscode.window.showErrorMessage("Error: Invalid map name!");
    }
}

export const statusBarItem = vscode.window.createStatusBarItem(undefined, 1000);
statusBarItem.command = "chartGraphX.toolbarAction";
statusBarItem.tooltip = "CGphX commands";
statusBarItem.text = "CGphX$(rocket)"; // to rotate icon ~spin
