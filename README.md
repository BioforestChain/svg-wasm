# svg-wasm

SVG Wasm toolkit, including `svg_to_png` and `svg_to_webp`, capable of detecting if an SVG causes a memory overflow.

## how to use within vite

```ts
import init, { compress, decompress } from "@dweb-browser/svg-wasm";
import zstd_wasm_url from "@dweb-browser/svg-wasm/svg_wasm.wasm?url";

init(zstd_wasm_url).then(() => {
  /// compress or decompress
  const output = compress(new Uint8Array(100), 10);
  const input = decompress(output);
  console.log(input, output);
});
```

The above method uses `fetch` to download the wasm file. If you don't want to use a network request, you can also directly import the binary, which is stored in base64 within a JS file. The final bundle size will be larger as a result.

```ts
import { compress, decompress, initSync } from "@dweb-browser/svg-wasm";
import get_zstd_wasm_binary from "@dweb-browser/svg-wasm/svg_wasm.ts";
initSync(get_zstd_wasm_binary());

/// compress or decompress
```

## how to use in nodejs

```ts
import fs from "node:fs";
import url from "node:url";
import { compress, decompress, initSync } from "@dweb-browser/svg-wasm";
const zstd_wasm_binary = fs.readFileSync(
  url.fileURLToPath(import.meta.resolve("@dweb-browser/svg-wasm/svg_wasm.wasm"))
);

initSync(zstd_wasm_binary);

/// compress or decompress
```

## how to use in deno

```ts
import { compress, decompress, initSync } from "@dweb-browser/svg-wasm";
import zstd_wasm_binary from "@dweb-browser/svg-wasm/svg_wasm.ts";
initSync(get_zstd_wasm_binary());

/// compress or decompress
const output = compress(new Uint8Array(100), 10);
const input = decompress(output);
console.log(input, output);
```

## how to build

1. install [wasm-bindgen]() `cargo install wasm-bindgen-cli`
1. install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
   `cargo install wasm-pack`
1. install [tsc](http://npmjs.com/package/typescript) `npm install -g typescript`
1. install [deno](https://deno.com/)
   ```
   curl -fsSL https://deno.land/install.sh | sh # macos or linux
   irm https://deno.land/install.ps1 | iex # windows
   ```
1. run script: `deno task build`
   > output to [pkg](./pkg) folder
