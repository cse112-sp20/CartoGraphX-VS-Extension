import * as vscode from "vscode";
import { sendGitData, setMapID } from "./git";
import { auth } from "./main";
import { generateWebview } from './webview';

export let currentMap : string = "";
/**
 * Function to display the current working file from the command
 */
export async function displayCurrentWorkingFile() {
    const rootPath = (vscode.workspace.rootPath !== undefined) ? vscode.workspace.rootPath : "";
    const openFileName = vscode.window.visibleTextEditors.map((e) => e.document.fileName.replace(rootPath, ""));
    const openFileLineCount = vscode.window.visibleTextEditors.map((e) => e.document.lineCount);
    // tslint:disable-next-line: max-line-length
    vscode.window.showInformationMessage("Currently in file: " + openFileName + "\n\nLines in file: " + openFileLineCount, { modal: true });
    return openFileName;
}

/**
 * Function to create a map from command
 */
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
        return true;
    } else {
        vscode.window.showErrorMessage("Error: Invalid map name!");
        return false;
    }
}

/**
 * Function to load a map from command
 */
export async function loadMapFunction() {
    const mapid = await vscode.window.showInputBox({placeHolder: "Enter a map ID"});
    if (mapid !== "" && mapid !== undefined) {
        let token = auth.currentUser?.getIdToken();
        if (token) {
            token.then(value => {
                setMapID(mapid);
                generateWebview(mapid);
            });
            token.catch(error => {
                vscode.window.showErrorMessage('Error: Unable to communicate with server!');
            });
        }
        return true;
    } else {
        vscode.window.showErrorMessage("Error: Invalid map id!");
        return false;
    }
}

export const statusBarItem = vscode.window.createStatusBarItem(undefined, 1000);
statusBarItem.command = "cartoGraphX.toolbarAction";
statusBarItem.tooltip = "CGphX commands";
statusBarItem.text = "CGphX$(rocket)"; // to rotate icon ~spin
