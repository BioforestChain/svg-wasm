import { detect_svg_render, initSync, svg_to_webp } from "@dweb-browser/svg-wasm";
import assert from "node:assert";
import fs from "node:fs";
import test from "node:test";
import url from "node:url";

const svg_wasm_binary = fs.readFileSync(
  url.fileURLToPath(
    import.meta.resolve("@dweb-browser/svg-wasm/svg_wasm_bg.wasm"),
  ),
);
initSync({ module: svg_wasm_binary })

test("svg_to_webp", () => {
  const svg = fs.readFileSync("../crash.svg")
  const webp_data = svg_to_webp(svg)
  fs.writeFileSync("./crash.webp", webp_data)
  assert.ok(detect_svg_render(svg, 2) == false)
})


