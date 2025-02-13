import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as myExtension from '../extension';

suite('File Size Inator Extension Test Suite', () => {
	vscode.window.showInformationMessage('Starting all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('joan-yoansinh-cifuentes.file-size-inator'));
	});

	test('Should activate', async () => {
		const ext = vscode.extensions.getExtension('joan-yoansinh-cifuentes.file-size-inator');
		await ext?.activate();
		assert.ok(true);
	});

	test('Status bar should be visible', async () => {
		const tmpDir = path.join(__dirname, 'tmp');
		if (!fs.existsSync(tmpDir)) {
			fs.mkdirSync(tmpDir);
		}
		
		const testFilePath = path.join(tmpDir, 'test.txt');
		const testContent = 'Hello World!';
		fs.writeFileSync(testFilePath, testContent);

		try {
			const doc = await vscode.workspace.openTextDocument(testFilePath);
			await vscode.window.showTextDocument(doc);

			await new Promise(resolve => setTimeout(resolve, 1000));

			const statusBarItems = (vscode.window as any).visibleStatusBarItems;
			const fileSizeItem = statusBarItems.find(
				(item: vscode.StatusBarItem) => item.tooltip === 'Current file size'
			);

			assert.ok(fileSizeItem, 'Status bar item should exist');
			assert.ok(fileSizeItem.text.includes('12 B'), 'Should show correct file size');

		} finally {
			if (fs.existsSync(testFilePath)) {
				fs.unlinkSync(testFilePath);
			}
			if (fs.existsSync(tmpDir)) {
				fs.rmdirSync(tmpDir);
			}
		}
	});

	test('Size conversion should work correctly', () => {
		const convertSize = (myExtension as any).convertSize;
		
		assert.strictEqual(convertSize(500), '500.00 B');
		assert.strictEqual(convertSize(1024), '1.00 KB');
		assert.strictEqual(convertSize(1024 * 1024), '1.00 MB');
		assert.strictEqual(convertSize(1024 * 1024 * 1024), '1.00 GB');
	});
});
