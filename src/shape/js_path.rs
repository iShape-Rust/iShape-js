use i_float::fix_float::FixFloat;
use i_float::fix_vec::FixVec;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use i_shape::fix_path::FixPath;

#[wasm_bindgen]
pub struct JsPath {
    path: FixPath,
}
#[wasm_bindgen]
impl JsPath {

    #[wasm_bindgen(constructor)]
    pub fn create_from_sequence(sequence: &[f64]) -> JsPath {
        let path = Self::sequence_to_path(sequence);
        JsPath { path }
    }

    #[wasm_bindgen(constructor)]
    pub fn create_from_points(points: &JsValue) -> JsPath {
        let flattened_points = flatten_points(points);
        JsPath::create_from_sequence(&flattened_points)
    }
}

impl JsPath {

    pub (super) fn new(path: &FixPath) -> JsPath {
        JsPath { path: path.clone() }
    }

    pub (crate) fn path(&self) -> &FixPath {
        &self.path
    }

    fn sequence_to_path(sequence: &[f64]) -> FixPath {
        if sequence.len() % 2 != 0 {
            return vec![FixVec::ZERO; 0]
        }
    
        let n = sequence.len() >> 1;
        let mut path = vec![FixVec::ZERO; n];
    
        // Now you can work with points as a Vec of tuples
        let mut i = 0;
        let mut j = 0;
        while i < n {
            let x = FixFloat::new_f64(sequence[j]);
            let y = FixFloat::new_f64(sequence[j + 1]);
            path[i] = FixVec::new_fix(x, y);
    
            i += 1;
            j += 2;
        }
    
        path
    }
}


#[wasm_bindgen(module = "/js/helpers.js")]
extern "C" {
    #[wasm_bindgen(js_name = flattenPoints)]
    fn flatten_points(points: &JsValue) -> Vec<f64>;
}