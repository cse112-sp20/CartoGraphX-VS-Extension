import * as vscode from 'vscode';
import {displayCurrentWorkingFile} from './chartgraphx';

export function activate(context: vscode.ExtensionContext) {
	// This line of code will only be executed once when your extension is activated
	console.log('ChartGraphX is now active!');

	const statusBarItem = vscode.window.createStatusBarItem(undefined, 1000);
	statusBarItem.command = 'chartGraphX.displayState';
	statusBarItem.tooltip = "run CGphX command";
	statusBarItem.text = "CGphX$(rocket)"; // to rotate icon ~spin
	statusBarItem.show();
	let disposable = vscode.commands.registerCommand('chartGraphX.displayState', () => {
		displayCurrentWorkingFile();
	}
	);
	
	context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {}
