import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0))
	});

	test('Extension test', () => {
		// TODO:
		// do testing for extension such like given tester file, extenion output need to match the expected # of lines for file.

		// do testing for extension such like given tester file, extension must outputs the correct file name
	});
});
