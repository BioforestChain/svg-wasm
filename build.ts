import fs from "node:fs";
import url from "node:url";
const resolve = (path: string) => url.fileURLToPath(import.meta.resolve(path));
const package_json_filepath = resolve("./pkg/package.json");
const version =
  Deno.args[0] ??
  (() => {
    try {
      return JSON.parse(fs.readFileSync(package_json_filepath, "utf-8"))
        .version;
    } catch {
      return "0.1.0";
    }
  })();
await new Deno.Command("wasm-pack", {
  args: [
    "build",
    "./",
    "--target",
    "web",
    "--release",
    "--scope",
    "dweb-browser",
  ],
}).spawn().status;

const packageJson = JSON.parse(fs.readFileSync(package_json_filepath, "utf-8"));
const svg_wasm_ts_filepath = resolve("./pkg/svg_wasm_bg_wasm.ts");
const ts = String.raw;
fs.writeFileSync(
  svg_wasm_ts_filepath,
  ts`
  function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  export const svg_wasm_base64:string = "${fs.readFileSync(
    resolve("./pkg/svg_wasm_bg.wasm"),
    "base64"
  )}";
  export default ()=>base64ToArrayBuffer(svg_wasm_base64)
`
);
new Deno.Command("deno", { args: ["fmt", svg_wasm_ts_filepath] }).outputSync();
new Deno.Command("tsc", {
  args: [svg_wasm_ts_filepath, "-m", "esnext", "-d"],
}).outputSync();
fs.unlinkSync(svg_wasm_ts_filepath);

Object.assign(packageJson, {
  files: [...packageJson.files, "svg_wasm.js", "svg_wasm.d.ts"],
  version: Deno.args[0] ?? version,
  type: "module",
  exports: {
    ".": {
      import: "./svg_wasm.js",
      types: "./svg_wasm.d.ts",
    },
    "./svg_wasm.wasm": "./svg_wasm_bg.wasm",
    "./svg_wasm_bg_wasm.ts": {
      import: "./svg_wasm_bg_wasm.js",
      types: "./svg_wasm_bg_wasm.d.ts",
    },
  },
  repository: {
    type: "git",
    url: "git://github.com/BioforestChain/svg-wasm.git",
  },
  bugs: {
    email: "gaubeebangeel@gmail.com",
    url: "https://github.com/BioforestChain/zstd-wasm/issues",
  },
  author: "Gaubee <gaubeebangeel@gmail.com>",
  license: "MIT",
  keywords: ["svg", "png", "webp"],
});

fs.writeFileSync(package_json_filepath, JSON.stringify(packageJson, null, 2));
