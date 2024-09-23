const test = require("node:test");
const fs = require("node:fs");
const { svg_to_webp } = require("@dweb-browser/svg-wasm");

test("svg_to_webp", () => {
  const svg = fs.readFileSync("../crash.svg")
  const webp_data = svg_to_webp(svg)
  fs.writeFileSync("./crash.webp", webp_data)
});