const vs = require('./vscode');
var sinon = require('sinon');
const act = require('./mockExtension');
test("Same test", () => {
	let x = 1 + 1;
	expect(x).toBe(2);
});

test("Extension test", () =>{
	const spy = sinon.spy(vs.commands, "registerCommand");
	act(vs);
	expect(spy.called).toBe(true);
	spy.restore();
});






