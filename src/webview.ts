import * as vscode from 'vscode';
import { gitRoot, mapId } from './git';

/**
 * Function to construct a webview in the second column that displays the web application
 */
export async function generateWebview() {
    const panel = vscode.window.createWebviewPanel(
        'mainPanel',
        'Realtime Source Code Map',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    let document : any = await vscode.workspace.openTextDocument(vscode.Uri.file(gitRoot + '/../ChartGraphX-Web-app-MVP/vscode.html'));
    let htmlString : string = document.getText();
    let parts : string[] = htmlString.split('id="mapKey"');
    htmlString = parts[0] + 'id="mapKey"' + ' value="' + mapId + '" ' + parts[1];
    panel.webview.html = htmlString;
}
