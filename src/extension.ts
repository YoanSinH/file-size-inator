import * as vscode from 'vscode';
import * as fs from 'fs';

const workspace = vscode.workspace;
const window = vscode.window;

let myStatusBar: vscode.StatusBarItem;

function configStatusBar(): vscode.StatusBarItem {
	myStatusBar = window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBar.tooltip = 'Current file size';
	myStatusBar.text = 'Calculating...';
	myStatusBar.command = 'file-size-inator.refresh';
	myStatusBar.show();
	return myStatusBar;
}

function convertSize(size: number): string {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let index = 0;
	while (size >= 1024 && index < units.length - 1) {
		size /= 1024;
		index++;
	}
	return `${size.toFixed(2)} ${units[index]}`;
}

function updateStatusBar(statusBar: vscode.StatusBarItem) {
	const editor = window.activeTextEditor;
	if (!editor) {
		statusBar.text = 'No file';
		return;
	}
	
	const filePath = editor.document.uri.fsPath;
	
	try {
		const stats = fs.statSync(filePath);
		const size = stats.size;
		statusBar.text = `$(file) ${convertSize(size)}`;
	} catch (error) {
		statusBar.text = 'Error reading file size';
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Activating File Size Inator extension');
	
	const statusBar = configStatusBar();
	
	let refreshCommand = vscode.commands.registerCommand('file-size-inator.refresh', () => {
		updateStatusBar(statusBar);
	});
	
	updateStatusBar(statusBar);
	
	const changeTextDisposable = workspace.onDidChangeTextDocument(() => {
		updateStatusBar(statusBar);
	});
	
	const changeEditorDisposable = window.onDidChangeActiveTextEditor(() => {
		updateStatusBar(statusBar);
	});
	
	context.subscriptions.push(statusBar);
	context.subscriptions.push(refreshCommand);
	context.subscriptions.push(changeTextDisposable);
	context.subscriptions.push(changeEditorDisposable);
}

export function deactivate() {
	if (myStatusBar) {
		myStatusBar.dispose();
	}
}
