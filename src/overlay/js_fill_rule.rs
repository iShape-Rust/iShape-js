use wasm_bindgen::prelude::*;
use i_overlay::bool::fill_rule::FillRule;

#[wasm_bindgen]
pub enum JsFillRule {
    Subject,
    Clip,
    Intersect,
    Union,
    Difference,
    Xor
}

impl From<JsFillRule> for FillRule {
    fn from(js_fill_rule: JsFillRule) -> Self {
        match js_fill_rule {
            JsFillRule::Subject => FillRule::Subject,
            JsFillRule::Clip => FillRule::Clip,
            JsFillRule::Intersect => FillRule::Intersect,
            JsFillRule::Union => FillRule::Union,
            JsFillRule::Difference => FillRule::Difference,
            JsFillRule::Xor => FillRule::Xor
        }
    }
}