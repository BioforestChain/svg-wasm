use resvg::{
    tiny_skia::{self, Pixmap, PremultipliedColorU8},
    usvg::{self, Options, Transform, Tree},
};
use wasm_bindgen::prelude::*;
use webp::Encoder;

#[wasm_bindgen]
pub fn svg_to_webp(svg: Vec<u8>, quality: f32) -> Result<Vec<u8>, String> {
    let opt = usvg::Options::default();
    let rtree =
        usvg::Tree::from_data(&svg, &opt).map_err(|_| "usvg from_data error".to_string())?;

    let pixmap_size = rtree.size();
    let width = pixmap_size.width() as u32;
    let height = pixmap_size.height() as u32;

    let mut pixmap =
        tiny_skia::Pixmap::new(width, height).ok_or("create Pixmap error".to_string())?;

    // 如果不需要去除透明度，这段代码可以省略
    for px in pixmap.pixels_mut() {
        *px =
            PremultipliedColorU8::from_rgba(255 - px.red(), 255 - px.green(), 255 - px.blue(), 255)
                .unwrap();
    }

    // 渲染 SVG 到 pixmap
    resvg::render(&rtree, usvg::Transform::default(), &mut pixmap.as_mut());

    // 编码为 WebP 格式
    let img = pixmap.data();
    let encoder = Encoder::from_rgba(img, width, height);
    let encoded_webp = encoder.encode(quality);
    Ok(encoded_webp.to_vec())
}

#[wasm_bindgen]
pub fn svg_to_png(
    svg_data: Vec<u8>,
    width: u32,
    height: u32,
    fit_mode: &str,
    layer_limit_size: f32,
) -> Result<Vec<u8>, String> {
    let mut output_width = width;
    let mut output_height = height;
    let mut transform = Transform::default();

    // 设置 SVG 渲染选项
    let mut opt = Options::default();
    opt.fontdb_mut().load_system_fonts();

    // 解析 SVG 数据
    let tree = Tree::from_data(&svg_data, &opt).unwrap();
    let pixmap_size = tree.size().to_int_size();
    let pixmap_width = pixmap_size.width();
    let pixmap_height = pixmap_size.height();

    // 调整输出大小和比例
    if output_width == 0 || output_height == 0 {
        output_width = pixmap_width;
        output_height = pixmap_height;
    }
    if fit_mode == "Fill" {
        let sx = output_width as f32 / pixmap_width as f32;
        let sy = output_height as f32 / pixmap_height as f32;
        transform = transform.post_scale(sx, sy);
    } else if fit_mode == "Contain" {
        let aspect_ratio = pixmap_width as f32 / pixmap_height as f32;
        let output_ratio = output_width as f32 / output_height as f32;
        let sx: f32;
        let sy: f32;
        if aspect_ratio > output_ratio {
            sx = output_width as f32 / pixmap_width as f32;
            sy = sx;
            output_height = (output_width as f32 / aspect_ratio) as u32;
        } else {
            sy = output_height as f32 / pixmap_height as f32;
            sx = sy;
            output_width = (output_height as f32 * aspect_ratio) as u32;
        }
        transform = transform.post_scale(sx, sy);
    }

    // 创建 Pixmap
    let mut pixmap = Pixmap::new(output_width, output_height).unwrap();

    // 检查图层边界并限制大小
    let bbox = tree.root().abs_layer_bounding_box();
    if bbox.width() * bbox.height() > layer_limit_size {
        return Err("Memory overflow".to_string()); // 如果超过限制，返回空数组
    }

    // 渲染并编码为 PNG
    resvg::render(&tree, transform, &mut pixmap.as_mut());
    Ok(pixmap.encode_png().unwrap_or_else(|_| vec![]))
}
