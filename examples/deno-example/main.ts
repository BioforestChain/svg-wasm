import { compress, decompress, initSync } from "@dweb-browser/zstd-wasm";
import zstd_wasm_binary from "@dweb-browser/zstd-wasm/zstd_wasm_bg_wasm.ts";

export async function demo() {
    initSync(await zstd_wasm_binary());

    const input = new Uint8Array(100);
    const output = compress(input, 10);
    const input2 = decompress(output);
    return [input, output, input2] as const;
}

if (import.meta.main) {
    void demo();
}
