import fs from "node:fs";
import url from "node:url";
const resolve = (path: string) => url.fileURLToPath(import.meta.resolve(path));
const package_json_filepath = resolve("./pkg/package.json");
const version = Deno.args[0] ?? (() => {
  try {
    return JSON.parse(fs.readFileSync(package_json_filepath, "utf-8")).version;
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
const zstd_wasm_bg_wasm_ts_filepath = resolve("./pkg/zstd_wasm_bg_wasm.ts");
const ts = String.raw;
fs.writeFileSync(
  zstd_wasm_bg_wasm_ts_filepath,
  ts`
  export const zstd_wasm_bg_wasm_base64:string = "${
    fs.readFileSync(resolve("./pkg/zstd_wasm_bg.wasm"), "base64")
  }";
  export default ()=>fetch("data:application/wasm;base64,"+zstd_wasm_bg_wasm_base64).then(res=>res.blob()).then(blob=>blob.arrayBuffer())
`,
);
new Deno.Command("deno", { args: ["fmt", zstd_wasm_bg_wasm_ts_filepath] })
  .outputSync();
new Deno.Command("tsc", {
  args: [zstd_wasm_bg_wasm_ts_filepath, "-m", "esnext", "-d"],
}).outputSync();
fs.unlinkSync(zstd_wasm_bg_wasm_ts_filepath);

Object.assign(packageJson, {
  files: [
    ...packageJson.files,
    "zstd_wasm_bg_wasm.js",
    "zstd_wasm_bg_wasm.d.ts",
  ],
  version: Deno.args[0] ?? version,
  type: "module",
  exports: {
    ".": {
      import: "./zstd_wasm.js",
      types: "./zstd_wasm.d.ts",
    },
    "./zstd_wasm_bg.wasm": "./zstd_wasm_bg.wasm",
    "./zstd_wasm_bg_wasm.ts": {
      import: "./zstd_wasm_bg_wasm.js",
      types: "./zstd_wasm_bg_wasm.d.ts",
    },
  },
  repository: {
    type: "git",
    url: "git://github.com/BioforestChain/zstd-wasm.git",
  },
  bugs: {
    email: "gaubeebangeel@gmail.com",
    url: "https://github.com/BioforestChain/zstd-wasm/issues",
  },
  author: "Gaubee <gaubeebangeel@gmail.com>",
  license: "MIT",
  keywords: ["zstd", "compression", "decompression"],
});

fs.writeFileSync(package_json_filepath, JSON.stringify(packageJson, null, 2));
