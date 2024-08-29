use i_overlay::i_float::f64_adapter::F64PointAdapter;
use i_overlay::i_float::f64_point::F64Point;
use i_overlay::i_shape::f64::shape::{F64Path, F64Shape};
use i_overlay::vector::vector::VectorEdge;
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

pub type ShapesData = Vec<ShapeData>;
pub type ShapeData = Vec<PathData>;
pub type PathData = Vec<[f64; 2]>;

pub(super) trait JSShapeData {
    fn to_f64shape(&self) -> F64Shape;
    fn create_from_json(js_value: JsValue) -> Self;
    fn create(shape: &F64Shape) -> Self;
}

pub(super) trait JSPathData {
    fn to_f64path(&self) -> F64Path;
    fn create_from_json(js_value: JsValue) -> Self;
    fn create(path: &F64Path) -> Self;
}

impl JSShapeData for ShapeData {
    fn to_f64shape(&self) -> F64Shape {
        self.iter().map(|path| path.to_f64path()).collect()
    }

    fn create_from_json(js_value: JsValue) -> Self {
        serde_wasm_bindgen::from_value(js_value).unwrap()
    }

    fn create(shape: &F64Shape) -> Self {
        shape.iter().map(|path| JSPathData::create(path)).collect()
    }
}

impl JSPathData for PathData {
    fn to_f64path(&self) -> F64Path {
        self.iter().map(|p| F64Point::new(p[0], p[1])).collect()
    }

    fn create_from_json(js_value: JsValue) -> Self {
        serde_wasm_bindgen::from_value(js_value).unwrap()
    }

    fn create(path: &F64Path) -> Self {
        path.iter().map(|v| [v.x, v.y]).collect()
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
    pub(super) fn create(vectors: Vec<VectorEdge>, adapter: &F64PointAdapter) -> Self {
        let mut list = Vec::with_capacity(vectors.len());
        for vector in vectors.into_iter() {
            let a = adapter.convert_to_float(&vector.a);
            let b = adapter.convert_to_float(&vector.b);
            let fill = vector.fill;

            list.push(VectorData { ax: a.x, ay: a.y, bx: b.x, by: b.y, fill });
        }
        Self { vectors: list }
    }
}