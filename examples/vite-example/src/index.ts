import init, { svg_to_webp } from "@dweb-browser/svg-wasm";
import svg_wasm_url from "@dweb-browser/svg-wasm/svg_wasm_bg.wasm?url";

// 初始化 WebAssembly 模块
init(svg_wasm_url).then(() => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".svg";
  input.onchange = async () => {
    if (!input.files) return;
    const file = input.files[0];

    const svgBuffer = await file.arrayBuffer();
    const webp_data = svg_to_webp(new Uint8Array(svgBuffer), 5242880.0);

    // 创建一个 Blob 并使用 URL.createObjectURL 生成一个下载链接
    const blob = new Blob([webp_data], { type: "image/webp" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test.webp";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  document.body.appendChild(input);
});
