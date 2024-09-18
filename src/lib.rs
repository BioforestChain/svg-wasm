mod test;

use image::{DynamicImage, ImageFormat};
use resvg::{
    tiny_skia::{self, Pixmap, PremultipliedColorU8},
    usvg::{self, Options, Transform, Tree},
};
use std::io::Cursor;
use wasm_bindgen::prelude::*;

/// `detect_svg_render` Check whether the SVG is overflowing
///
/// # Examples
/// ```
/// let svg_data = std::fs::read(format!("./examples/test.svg")).unwrap();
/// let bool = detect_svg_render(svg_data, Some(5242880.0));
/// ```
#[wasm_bindgen]
pub fn detect_svg_render(svg: Vec<u8>, layer_limit_size: Option<f32>) -> bool {
    let opt = usvg::Options::default();
    let limit_size = layer_limit_size.unwrap_or(5242880.0); // 默认上限是5mb
    let rtree = usvg::Tree::from_data(&svg, &opt).map_err(|_| "usvg from_data error".to_string());
    match rtree {
        Ok(tree) => {
            // 检查图层边界并限制大小
            let bbox = tree.root().abs_layer_bounding_box();
            // println!("Width: {}", bbox.width());
            // println!("Height: {}", bbox.height());
            // println!("Area: {}", bbox.width() * bbox.height());
            // println!("limit_size:{}", limit_size);
            if bbox.width() * bbox.height() > limit_size {
                return false; // 如果超过限制
            };
            return true;
        }
        Err(e) => {
            println!("error:{}", e);
            return false;
        }
    }
}

/// `svg_to_webp` svg to webp
///
/// # Examples
/// ```
/// let svg_data = std::fs::read(format!("./examples/test.svg")).unwrap();
/// let webp_data = svg_to_webp(svg_data, Some(5242880.0), None);
/// match webp_data {
///             Ok(data) => {
///                 std::fs::write(format!("./examples/test.webp"), data).unwrap();
///             }
///             Err(err) => println!("error:{}", err),
///         }
/// ```
#[wasm_bindgen]
pub fn svg_to_webp(
    svg: Vec<u8>,
    layer_limit_size: Option<f32>,
    remote_alpha: Option<bool>,
) -> Result<Vec<u8>, String> {
    let opt = usvg::Options::default();
    let limit_size = layer_limit_size.unwrap_or(5242880.0); // 默认上限是5mb
    let is_clear_alpha = remote_alpha.unwrap_or(false); // 默认不去除透明
    let rtree =
        usvg::Tree::from_data(&svg, &opt).map_err(|_| "usvg from_data error".to_string())?;

    let pixmap_size = rtree.size();
    let width = pixmap_size.width() as u32;
    let height = pixmap_size.height() as u32;

    let mut pixmap =
        tiny_skia::Pixmap::new(width, height).ok_or("create Pixmap error".to_string())?;
    // 检查图层边界并限制大小
    let bbox = rtree.root().abs_layer_bounding_box();
    if bbox.width() * bbox.height() > limit_size {
        return Err("Memory overflow".to_string()); // 如果超过限制，返回空数组
    }

    // 是否去除透明度
    if is_clear_alpha {
        for px in pixmap.pixels_mut() {
            *px = PremultipliedColorU8::from_rgba(
                255 - px.red(),
                255 - px.green(),
                255 - px.blue(),
                255,
            )
            .unwrap();
        }
    }
    // 渲染 SVG 到 pixmap
    resvg::render(&rtree, usvg::Transform::default(), &mut pixmap.as_mut());
    // 将渲染的 Pixmap 转换为 DynamicImage
    let img = DynamicImage::ImageRgba8(
        image::RgbaImage::from_raw(pixmap.width(), pixmap.height(), pixmap.take()).unwrap(),
    );

    // 创建一个 Cursor 作为内存缓冲区
    let mut buffer = Cursor::new(Vec::new());

    // 将图像编码为 WebP 格式并输出到缓冲区
    let _ = img.write_to(&mut buffer, ImageFormat::WebP);

    // 返回 WebP 数据的 Vec<u8>
    let webp_data = buffer.into_inner();

    println!("SVG 转 WebP 成功！");
    Ok(webp_data)
}

/// `svg_to_webp` takes SVG data along with rendering parameters, adjusts the output size
/// and scale based on the fit mode, renders the SVG, and encodes the result as a PNG image.
///
/// fit_mode Fill || Contain
/// # Examples
/// ```
/// let svg_data = std::fs::read(format!("./examples/test.svg")).unwrap();
/// let png_data = svg_to_png(svg_data.clone(),996.0,500.0,Contain,Some(5242880.0));
// std::fs::write(format!("./output/{name}.contain.png"), png_data).unwrap();
/// ```
#[wasm_bindgen]
pub fn svg_to_png(
    svg_data: Vec<u8>,
    width: u32,
    height: u32,
    fit_mode: &str,
    layer_limit_size: Option<f32>,
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
    // 采用填充的方式，图片可能会变形
    if fit_mode == "Fill" {
        let sx = output_width as f32 / pixmap_width as f32;
        let sy = output_height as f32 / pixmap_height as f32;
        transform = transform.post_scale(sx, sy);
    } else if fit_mode == "Contain" {
        // 采用等比例放大，不会导致图片变形
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
    let limit_size = layer_limit_size.unwrap_or(5242880.0); // 默认上限是5mb
    if bbox.width() * bbox.height() > limit_size {
        return Err("Memory overflow".to_string()); // 如果超过限制，返回空数组
    }

    // 渲染并编码为 PNG
    resvg::render(&tree, transform, &mut pixmap.as_mut());
    Ok(pixmap.encode_png().unwrap_or_else(|_| vec![]))
}
