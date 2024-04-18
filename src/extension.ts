// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fellowed" is now active!');

    // Create a decoration type for the cursor
    const cursorDecoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 255, 0, 0.5)', // Semi-transparent yellow background
        dark: {
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
        },
        light: {
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
        },
        isWholeLine: true // Decorate the whole line where the cursor is
    });

    // Function to update the cursor decoration
    function updateCursorDecoration(editor) {
        if (!editor) {
            return;
        }

        const cursorPosition = editor.selection.active;
        const range = new vscode.Range(cursorPosition.line, 0, cursorPosition.line, 0);

        editor.setDecorations(cursorDecoration, [range]);
    }

    // Subscribe to selection change events to update the cursor decoration
    vscode.window.onDidChangeTextEditorSelection(event => {
        updateCursorDecoration(event.textEditor);
    }, null, context.subscriptions);

    // Subscribe to active editor change events to update the cursor decoration
    vscode.window.onDidChangeActiveTextEditor(editor => {
        updateCursorDecoration(editor);
    }, null, context.subscriptions);

    // Initially set the decoration for the active editor
    updateCursorDecoration(vscode.window.activeTextEditor);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('fellowed.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.createTerminal('Fellowed Terminal');
        vscode.window.showInformationMessage('Hello World from fellowed!');
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
