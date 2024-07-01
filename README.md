# zstd-wasm

build with [zstd-rs](https://github.com/gyscos/zstd-rs)

## how to use within vite

```ts
import init, { compress, decompress } from "@dweb-browser/zstd-wasm";
import zstd_wasm_url from "@dweb-browser/zstd-wasm/zstd_wasm_bg.wasm?url";

init(zstd_wasm_url).then(() => {
  const output = compress(new Uint8Array(100), 10);
  const input = decompress(output);
  console.log(input, output);
});
```

## how to use in nodejs

```ts
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
```

## how to build

1. read https://github.com/gyscos/zstd-rs/wiki/Compile-for-WASM
1. install [wasm-bindgen]()
   `cargo install wasm-bindgen-cli`
1. install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
   `cargo install wasm-pack`
1. install [deno](https://deno.com/)
   ```
   curl -fsSL https://deno.land/install.sh | sh # macos or linux
   irm https://deno.land/install.ps1 | iex # windows
   ```
1. run script: `deno task build`
   > output to [pkg](./pkg) folder
