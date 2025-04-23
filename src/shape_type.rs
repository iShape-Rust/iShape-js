use i_triangle::i_overlay::core::overlay::ShapeType as RustShapeType;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum ShapeType {
    Subject,
    Clip,
}

impl From<ShapeType> for RustShapeType {
    fn from(shape_type: ShapeType) -> Self {
        match shape_type {
            ShapeType::Subject => RustShapeType::Subject,
            ShapeType::Clip => RustShapeType::Clip
        }
    }
}