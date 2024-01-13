use wasm_bindgen::prelude::*;
use i_overlay::bool::overlay_rule::OverlayRule as RustOverlayRule;

#[wasm_bindgen]
pub enum OverlayRule {
    Subject,
    Clip,
    Intersect,
    Union,
    Difference,
    Xor,
}

impl From<OverlayRule> for RustOverlayRule {
    fn from(overlay_rule: OverlayRule) -> Self {
        match overlay_rule {
            OverlayRule::Subject => RustOverlayRule::Subject,
            OverlayRule::Clip => RustOverlayRule::Clip,
            OverlayRule::Intersect => RustOverlayRule::Intersect,
            OverlayRule::Union => RustOverlayRule::Union,
            OverlayRule::Difference => RustOverlayRule::Difference,
            OverlayRule::Xor => RustOverlayRule::Xor
        }
    }
}