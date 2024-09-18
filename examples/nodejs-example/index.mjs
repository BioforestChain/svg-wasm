import { detect_svg_render, initSync, svg_to_webp } from "@dweb-browser/svg-wasm";
import fs from "node:fs";
import url from "node:url";
const svg_wasm_binary = fs.readFileSync(
  url.fileURLToPath(
    import.meta.resolve("@dweb-browser/svg-wasm/svg_wasm.wasm"),
  ),
);

initSync(svg_wasm_binary)

const svg = fs.readFileSync("../crash.svg")
const webp_data = svg_to_webp(svg)
fs.writeFileSync("./crash.webp", webp_data)

console.log("detect_svg_render=>", detect_svg_render(svg, 2))



