# svg-wasm

SVG Wasm toolkit, including `svg_to_png` and `svg_to_webp`,`detect_svg_render`, capable of detecting if an SVG causes a memory overflow.

## example

How to use the sample project that can be viewed, you can use this project on any platform without worrying about copyright issues.

### `detect_svg_render`

Check whether the SVG is overflowing。

```ts
console.log("detect_svg_render=>", detect_svg_render(svg, 2));
```

### `svg_to_webp`

```ts
const svg = fs.readFileSync("../test.svg");
const webp_data = svg_to_webp(svg);
fs.writeFileSync("./test.webp", webp_data);
```

### `svg_to_png`

The third parameter is that the fill type contains `Fill` and `Contain`.

- `Contain`: Equal proportional enlargement will not cause the image to be distorted.
- `Fill`:With filling, the image may be distorted.

```ts
const svg = fs.readFileSync("../test.svg");
const webp_data = svg_to_png(svg, 996.0, 500.0, "Contain", 5242880.0);
fs.writeFileSync("./test.png", webp_data);
```

## how to build

1. rustup target add wasm32-unknown-unknown
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
