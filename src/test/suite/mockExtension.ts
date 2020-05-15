const vscode = require('./vscode');

function mockActivate(){
	// This line of code will only be executed once when your extension is activated
	console.log('ChartGraphX is now active!');

	const statusBarItem = vscode.window.createStatusBarItem(undefined, 1000);
	statusBarItem.command = 'chartGraphX.displayState';
	statusBarItem.tooltip = "run CGphX command";
	statusBarItem.text = "CGphX$(rocket)"; // to rotate icon ~spin
	statusBarItem.show();
	let disposable = vscode.commands.registerCommand('chartGraphX.displayState', () => {
		const rootPath = (vscode.workspace.rootPath !== undefined) ? vscode.workspace.rootPath: "";
    
        let openFileName = vscode.window.visibleTextEditors.map(e => e.document.fileName.replace(rootPath, ""));
        let openFileLineCount = vscode.window.visibleTextEditors.map(e => e.document.lineCount);
        vscode.window.showInformationMessage('Currently in file: ' + openFileName + "\n\nLines in file: "+openFileLineCount, { modal: true });
    }
    );
}

module.exports = mockActivate;