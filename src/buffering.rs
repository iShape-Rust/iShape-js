use i_overlay::mesh::outline::offset::OutlineOffset;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
use crate::data::{NestedData};
use crate::style::{OutlineStyle, StrokeStyle};
use i_overlay::mesh::stroke::offset::StrokeOffset;

#[wasm_bindgen]
pub struct StrokeBuilder {
    pub style: StrokeStyle
}

#[wasm_bindgen]
pub struct OutlineBuilder {
    pub style: OutlineStyle
}

#[wasm_bindgen]
impl StrokeBuilder {

    #[wasm_bindgen]
    pub fn with_style(style: StrokeStyle) -> StrokeBuilder {
        StrokeBuilder { style }
    }

    #[wasm_bindgen]
    pub fn build(&self, path_js: JsValue, is_closed_path: bool) -> JsValue {
        let style = self.style.rust_style();

        let path_data = NestedData::with_json(path_js).unwrap();
        let shapes = match path_data {
            NestedData::Contour(contour) => contour.stroke(style, is_closed_path),
            NestedData::Shape(shape) => shape.stroke(style, is_closed_path),
            NestedData::Shapes(shapes) => shapes.stroke(style, is_closed_path),
        };

        serde_wasm_bindgen::to_value(&shapes).unwrap()
    }
}

#[wasm_bindgen]
impl OutlineBuilder {

    #[wasm_bindgen]
    pub fn with_style(style: OutlineStyle) -> OutlineBuilder {
        OutlineBuilder { style }
    }

    #[wasm_bindgen]
    pub fn build(&self, path_js: JsValue) -> JsValue {
        let style = self.style.rust_style();

        let path_data = NestedData::with_json(path_js).unwrap();
        let shapes = match path_data {
            NestedData::Contour(contour) => contour.outline(style),
            NestedData::Shape(shape) => shape.outline(style),
            NestedData::Shapes(shapes) => shapes.outline(style),
        };

        serde_wasm_bindgen::to_value(&shapes).unwrap()
    }
}