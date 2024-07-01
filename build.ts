import fs from "node:fs";
import url from "node:url";
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

const package_json_filepath = url.fileURLToPath(
  import.meta.resolve("./pkg/package.json")
);
const packageJson = JSON.parse(fs.readFileSync(package_json_filepath, "utf-8"));
Object.assign(packageJson, {
  version: Deno.args[0] ?? packageJson.version,
  type: "module",
  exports: {
    ".": {
      import: "./zstd_wasm.js",
      types: "./zstd_wasm.d.ts",
    },
    "./zstd_wasm_bg.wasm": "./zstd_wasm_bg.wasm",
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
