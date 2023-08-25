use wasm_bindgen::prelude::*;
use i_overlay::fill::shape_type::ShapeType;


#[wasm_bindgen]
pub enum JsShapeType {
    Subject,
    Clip
}

impl From<JsShapeType> for ShapeType {
    fn from(js_shape_type: JsShapeType) -> Self {
        match js_shape_type {
            JsShapeType::Subject => ShapeType::SUBJECT,
            JsShapeType::Clip => ShapeType::CLIP
        }
    }
}