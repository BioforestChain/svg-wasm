import { detect_svg_render, initSync, svg_to_webp } from "@dweb-browser/svg-wasm";
import fs from "node:fs";
import url from "node:url";
const svg_wasm_binary = fs.readFileSync(
  url.fileURLToPath(
    import.meta.resolve("@dweb-browser/svg-wasm/svg_wasm.wasm"),
  ),
);

initSync(svg_wasm_binary)

const svg = fs.readFileSync("../test.svg")
const webp_data = svg_to_webp(svg, 5242880.0)
fs.writeFileSync("./test.webp", webp_data)

console.log("detect_svg_render=>", detect_svg_render(svg, 2))



