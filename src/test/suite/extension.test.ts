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



	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0))
	});

	test('Extension test', () => {
		// TODO:
		// do testing for extension such like given tester file, extenion output need to match the expected # of lines for file.
		// do testing for extension such like given tester file, extension must outputs the correct file name
	});

