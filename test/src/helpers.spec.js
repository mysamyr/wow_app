const assert = require("assert");
const { parseQuery } = require("../../src/helpers");

describe("src > helpers", () => {
	describe("parseQuery", () => {
		it("should return params", () => {
			assert.deepStrictEqual(parseQuery({ u: "123" }), { params: "123" });
		});
	});
});
