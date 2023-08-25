use i_shape::fix_shape::FixShape;
use wasm_bindgen::prelude::*;
use i_shape::fix_path::FixPath;

use crate::shape::{js_path::JsPath, data::{ShapeData, PathData}};


#[wasm_bindgen]
pub struct JsShape {
    shape: FixShape
}

#[wasm_bindgen]
impl JsShape {

    #[wasm_bindgen(constructor)]
    pub fn create() -> JsShape {
        let paths: Vec<FixPath> = Vec::new();
        JsShape { shape: FixShape::new(paths) }
    }

    #[wasm_bindgen(constructor)]
    pub fn create_from_data(js_value: JsValue) -> JsShape {
        let parse_result = serde_wasm_bindgen::from_value(js_value);
        
        let mut msg = String::new();
        let data: ShapeData = parse_result.expect(&msg);

        JsShape { shape: data.shape() }
    }

    #[wasm_bindgen(constructor)]
    pub fn create_from_contour(js_value: JsValue) -> JsShape {
        let parse_result = serde_wasm_bindgen::from_value(js_value);
        let mut msg = String::new();
        let data: PathData = parse_result.expect(&msg);

        let mut paths: Vec<FixPath> = Vec::new();
        paths.push(data.path());

        let shape = FixShape::new(paths);
        
        JsShape { shape }
    }

    #[wasm_bindgen]
    pub fn add_hole(&mut self, js_value: JsValue) {
        let parse_result = serde_wasm_bindgen::from_value(js_value);
        let mut msg = String::new();
        let data: PathData = parse_result.expect(&msg);

        self.shape.add_hole(data.path());
    }

    #[wasm_bindgen]
    pub fn contour(&self) -> JsPath {
        self.path_at_index(0)
    }

    #[wasm_bindgen]
    pub fn paths_count(&self) -> usize {
        self.shape.paths_count()
    }

    #[wasm_bindgen]
    pub fn path_at_index(&self, index: usize) -> JsPath {
        let path = self.shape.path_at_index(index);
        JsPath::new(path)
    }

}

impl JsShape {

    pub (crate) fn new(shape: FixShape) -> JsShape {
        JsShape { shape: shape }
    }

    fn create_path(points: &JsValue) -> JsPath {
        let flattened_points = flattenPointsInPath(points);
        PathData::sequence_to_path(sequence);
    }


}




#[wasm_bindgen(module = "/js/helpers.js")]
extern "C" {
    #[wasm_bindgen(js_name = flattenPointsInShape)]
    fn flattenPointsInShape(paths: &JsValue) -> JsValue;

    #[wasm_bindgen(js_name = flattenPointsInPath)]
    fn flattenPointsInPath(paths: &JsValue) -> JsValue;

}