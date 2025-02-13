import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-size-inator" is now active!');

	const disposable = vscode.commands.registerCommand('file-size-inator.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from file-size-inator!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
