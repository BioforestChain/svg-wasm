

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
export const svg_wasm_bg_wasm_base64: string = "SVG_WASM_BG_WASM_BASE64";
export default () => base64ToArrayBuffer(svg_wasm_bg_wasm_base64);
