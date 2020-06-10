import * as vscode from 'vscode';
import { gitRoot } from './git';
import { XMLHttpRequest } from 'xmlhttprequest-ts';

/**
 * Function to construct a webview in the second column that displays the web application
 * @param {string} mapID 
 */
export async function generateWebview(mapID : string) {
    const panel = vscode.window.createWebviewPanel(
        'mainPanel',
        'Realtime Source Code Map',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    
    let req = new XMLHttpRequest();
    req.open('GET', 'https://raw.githubusercontent.com/cse112-sp20/CartoGraphX-Web-App/vscode-webview/vscode.html', true);
    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                let htmlString : string = req.responseText;
                let parts : string[] = htmlString.split('id="mapKey"');
                htmlString = parts[0] + 'id="mapKey"' + ' value="' + mapID + '" ' + parts[1];
                panel.webview.html = htmlString;
            } else {
                vscode.window.showErrorMessage('An error has occurred while communicating with the server!');
            }
        }
    };
    req.send();
}
