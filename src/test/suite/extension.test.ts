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






