import fs from "node:fs";
import url from "node:url";
import { initSync, compress, decompress } from "@dweb-browser/zstd-wasm";
const zstd_wasm_binary = fs.readFileSync(
  url.fileURLToPath(
    import.meta.resolve("@dweb-browser/zstd-wasm/zstd_wasm_bg.wasm")
  )
);

initSync(zstd_wasm_binary);

const output = compress(new Uint8Array(100), 10);
const input = decompress(output);
console.log(input, output);
