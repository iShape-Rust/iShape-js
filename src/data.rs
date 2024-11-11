use i_overlay::i_float::adapter::FloatPointAdapter;
use i_overlay::vector::edge::VectorEdge;
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

pub type ShapesData = Vec<ShapeData>;
pub type ShapeData = Vec<PathData>;
pub type PathData = Vec<[f64; 2]>;

#[derive(Deserialize)]
#[serde(untagged)]
pub(super) enum NestedData {
    Path(Vec<[f64; 2]>),
    Shape(Vec<Vec<[f64; 2]>>),
    Shapes(Vec<Vec<Vec<[f64; 2]>>>),
}

impl NestedData {
    pub(super) fn with_json(js_value: JsValue) -> Option<Self> {
        let nested_data: Result<NestedData, _> = serde_wasm_bindgen::from_value(js_value);
        if let Ok(data) = nested_data {
            Some(data)
        } else {
            None
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct VectorData {
    pub ax: f64,
    pub ay: f64,
    pub bx: f64,
    pub by: f64,
    pub fill: u8,
}

#[derive(Serialize, Deserialize)]
pub struct VectorsData {
    pub vectors: Vec<VectorData>,
}

impl VectorsData {
    pub(super) fn create(vectors: Vec<VectorEdge>, adapter: &FloatPointAdapter<[f64; 2], f64>) -> Self {
        let mut list = Vec::with_capacity(vectors.len());
        for vector in vectors.into_iter() {
            let a = adapter.int_to_float(&vector.a);
            let b = adapter.int_to_float(&vector.b);
            let fill = vector.fill;

            list.push(VectorData { ax: a[0], ay: a[1], bx: b[0], by: b[1], fill });
        }
        Self { vectors: list }
    }
}