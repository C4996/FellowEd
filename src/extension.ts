// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

async function duplicateActiveEditor(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const fileUri = activeEditor.document.uri;
        const newDocument = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(newDocument, { viewColumn: vscode.ViewColumn.Beside });
    } else {
        vscode.window.showErrorMessage("没有活动的文本编辑器.");
    }
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fellowed" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fellowed.open2side', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.createTerminal('Fellowed Terminal');
		vscode.window.showInformationMessage('FellowED: Open this file to right side');

		console.log(vscode.window.activeTextEditor);
		duplicateActiveEditor();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
