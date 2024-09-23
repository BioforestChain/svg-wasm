import init from "@dweb-browser/svg-wasm";
import svg_wasm_url from "@dweb-browser/svg-wasm/svg_wasm_bg.wasm?url";

import { test_svg_to_webp } from "./index.ts";

init(svg_wasm_url).then(() => {
  test_svg_to_webp("fetch test");
});
