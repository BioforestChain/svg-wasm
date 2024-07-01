use std::io::Cursor;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn compress(source: Vec<u8>, level: i32) -> Vec<u8> {
    return zstd::stream::encode_all(Cursor::new(source), level).unwrap();
}

#[wasm_bindgen]
pub fn decompress(source: Vec<u8>) -> Vec<u8> {
    return zstd::stream::decode_all(Cursor::new(source)).unwrap();
}
