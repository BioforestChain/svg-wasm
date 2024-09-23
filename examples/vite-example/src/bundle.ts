import { initSync } from "@dweb-browser/svg-wasm";
import get_svg_wasm_binary from "@dweb-browser/svg-wasm/svg_wasm_bg_wasm";
initSync(get_svg_wasm_binary());

import "./index.ts";
