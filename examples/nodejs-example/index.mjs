import { svg_to_webp } from "@dweb-browser/svg-wasm";
import fs from "node:fs";
import url from "node:url";
const svg_wasm_binary = fs.readFileSync(
  url.fileURLToPath(
    import.meta.resolve("@dweb-browser/svg-wasm/svg_wasm_bg.wasm"),
  ),
);

svg_to_webp()

