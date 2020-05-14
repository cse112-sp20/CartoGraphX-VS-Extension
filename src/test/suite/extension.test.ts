const vs = require('./vscode');
var sinon = require('sinon');
test("Same test", () => {
	let x = 1 + 1;
	expect(x).toBe(2);
});

test("Extension test", () =>{
	const spy = sinon.spy(vs.window, "showInformationMessage");
	console.log(spy.called); // false
	vs.window.showInformationMessage("Test");
	console.log(spy.called); // true
	expect(spy.called).toBe(true);
	spy.restore();
});








// import * as assert from 'assert';

// // You can import and use all API from the 'vscode' module
// // as well as import your extension to test it
// import sinon from "ts-sinon";
// import * as vscode from 'vscode';
// // import * as myExtension from '../../extension';


// suite('Extension Test Suite', () => {
// 	vscode.window.showInformationMessage('Start all tests.');

// 	test('Sample test', () => {
// 		assert.equal(-1, [1, 2, 3].indexOf(5));
// 		assert.equal(-1, [1, 2, 3].indexOf(0));
// 	});
// 	test('Extension test', () => {
		// const spy = sinon.spy(vscode.window, "showInformationMessage");
		// console.log(spy.called); // false
		// vscode.window.showInformationMessage("Test");
		// console.log(spy.called); // true
		// assert.equal(spy.called, true);
		// spy.restore();
// 	});
// });

