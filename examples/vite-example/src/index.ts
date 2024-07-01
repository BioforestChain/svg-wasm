import init, { compress, decompress } from "@dweb-browser/zstd-wasm";
import zstd_wasm_url from "@dweb-browser/zstd-wasm/zstd_wasm_bg.wasm?url";

init(zstd_wasm_url).then(() => {
  const output = compress(new Uint8Array(100), 10);
  const input = decompress(output);
  console.log(input, output);
});
