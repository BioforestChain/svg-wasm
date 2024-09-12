import init, { compress, decompress } from "@dweb-browser/svg-wasm";
import zstd_wasm_url from "@dweb-browser/svg-wasm/svg_wasm.wasm?url";

init(zstd_wasm_url).then(() => {
  const output = compress(new Uint8Array(100), 10);
  const input = decompress(output);
  console.log(input, output);
});
