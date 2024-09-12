import { compress, decompress, initSync } from "@dweb-browser/svg-wasm";
import fs from "node:fs";
import url from "node:url";
const zstd_wasm_binary = fs.readFileSync(
  url.fileURLToPath(
    import.meta.resolve("@dweb-browser/svg-wasm/svg_wasm.wasm"),
  ),
);

initSync(zstd_wasm_binary);

const output = compress(new Uint8Array(100), 10);
const input = decompress(output);
console.log(input, output);
