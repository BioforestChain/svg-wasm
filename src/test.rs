#[cfg(test)]
mod test {
    use crate::svg_to_webp;

    #[test]
    fn test_svg_to_webp() {
        let svg_data = std::fs::read(format!("./examples/test.svg")).unwrap();
        let webp_data = svg_to_webp(svg_data, 100, Some(5242880.0), None);
        match webp_data {
            Ok(data) => {
                std::fs::write(format!("./examples/test.webp"), data).unwrap();
            }
            Err(err) => println!("error:{}", err),
        }
    }
}
