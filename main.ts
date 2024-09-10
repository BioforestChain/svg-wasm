import { compress, decompress, initSync } from "./pkg/zstd_wasm.js";
import zstd_wasm_binary from "./pkg/zstd_wasm_bg_wasm.js";

export function demo() {
  initSync(zstd_wasm_binary());

  const input = new Uint8Array(100);
  const output = compress(input, 10);
  const input2 = decompress(output);
  return [input, output, input2] as const;
}

if (import.meta.main) {
  void demo();
}
