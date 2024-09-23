import fs from "node:fs";
import url from "node:url";
import { $ } from "./$.ts";

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

await $("wasm-pack", "build ./ --target web --dev --scope dweb-browser");
fs.renameSync(resolve("../pkg/svg_wasm.js"), resolve("../pkg/svg_wasm.mjs"));
await $("wasm-pack", "build ./ --target nodejs --release --scope dweb-browser");


const packageJson = JSON.parse(fs.readFileSync(package_json_filepath, "utf-8"));
const write_svg_wasm_bg_wasm_file = (SVG_WASM_BG_WASM_BASE64: string) => {
  const svg_wasm_bg_wasm_ts_filepath = resolve("../pkg/svg_wasm_bg_wasm.ts");
  fs.writeFileSync(
    svg_wasm_bg_wasm_ts_filepath,
    fs
      .readFileSync(resolve("./template/svg_wasm_bg_wasm.ts"), "utf8")
      .replace("SVG_WASM_BG_WASM_BASE64", SVG_WASM_BG_WASM_BASE64)
  );
};
write_svg_wasm_bg_wasm_file(
  fs.readFileSync(resolve("../pkg/svg_wasm_bg.wasm"), "base64")
);
$.cd(resolve("../pkg"));
await $(
  "esbuild",
  "svg_wasm_bg_wasm.ts --format=esm --outfile=svg_wasm_bg_wasm.mjs"
);
await $(
  "esbuild",
  "svg_wasm_bg_wasm.ts --format=cjs --outfile=svg_wasm_bg_wasm.js"
);
write_svg_wasm_bg_wasm_file("");

Object.assign(packageJson, {
  files: [...packageJson.files,"svg_wasm.mjs","svg_wasm_bg_wasm.mjs", "svg_wasm_bg_wasm.js", "svg_wasm_bg_wasm.d.ts"],
  version: Deno.args[0] ?? version,
  type: "module",
  exports: {
    ".": {
      import: "./svg_wasm.mjs",
      types: "./svg_wasm.d.ts",
      require:"./svg_wasm.js"
    },
    "./svg_wasm_bg.wasm": "./svg_wasm_bg.wasm",
    "./svg_wasm_bg_wasm": {
      import: "./svg_wasm_bg_wasm.mjs",
      types: "./svg_wasm_bg_wasm.d.ts",
      require:"./svg_wasm_bg_wasm.js"
    },
  },
  repository: {
    type: "git",
    url: "git://github.com/BioforestChain/svg-wasm.git",
  },
  bugs: {
    email: "gaubeebangeel@gmail.com",
    url: "https://github.com/BioforestChain/svg-wasm/issues",
  },
  author: "Gaubee <gaubeebangeel@gmail.com>",
  license: "MIT",
  keywords: ["svg", "png", "webp"],
});

fs.writeFileSync(package_json_filepath, JSON.stringify(packageJson, null, 2));
