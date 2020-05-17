import * as vscode from "vscode";

export const  displayCurrentWorkingFile = () => {
    const rootPath = (vscode.workspace.rootPath !== undefined) ? vscode.workspace.rootPath : "";
    const openFileName = vscode.window.visibleTextEditors.map((e) => e.document.fileName.replace(rootPath, ""));
    const openFileLineCount = vscode.window.visibleTextEditors.map((e) => e.document.lineCount);
    // tslint:disable-next-line: max-line-length
    vscode.window.showInformationMessage("Currently in file: " + openFileName + "\n\nLines in file: " + openFileLineCount, { modal: true });
};

export const statusBarItem = vscode.window.createStatusBarItem(undefined, 1000);
statusBarItem.command = "chartGraphX.toolbarAction";
statusBarItem.tooltip = "CGphX commands";
statusBarItem.text = "CGphX$(rocket)"; // to rotate icon ~spin
