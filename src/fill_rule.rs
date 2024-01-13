use i_overlay::bool::fill_rule::FillRule as RustFillRule;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub enum FillRule {
    EvenOdd,
    NonZero,
}

impl From<FillRule> for RustFillRule {
    fn from(js_fill_rule: FillRule) -> Self {
        match js_fill_rule {
            FillRule::EvenOdd => RustFillRule::EvenOdd,
            FillRule::NonZero => RustFillRule::NonZero
        }
    }
}