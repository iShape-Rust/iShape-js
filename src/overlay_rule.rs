use wasm_bindgen::prelude::*;
use i_triangle::i_overlay::core::overlay_rule::OverlayRule as RustOverlayRule;

#[wasm_bindgen]
pub enum OverlayRule {
    Subject,
    Clip,
    Intersect,
    Union,
    Difference,
    InverseDifference,
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
            OverlayRule::InverseDifference => RustOverlayRule::InverseDifference,
            OverlayRule::Xor => RustOverlayRule::Xor
        }
    }
}