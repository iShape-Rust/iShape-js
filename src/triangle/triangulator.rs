use crate::data::NestedData;
use i_triangle::float::delaunay::Delaunay as RustDelaunay;
use i_triangle::float::triangulatable::Triangulatable;
use i_triangle::float::triangulation::RawTriangulation as RustRawTriangulation;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
pub struct RawTriangulation {
    raw: RustRawTriangulation<[f64; 2], f64>,
}

#[wasm_bindgen]
pub struct Delaunay {
    delaunay: RustDelaunay<[f64; 2], f64>,
}

#[wasm_bindgen]
pub struct Triangulator {}

#[wasm_bindgen]
impl Triangulator {
    #[wasm_bindgen]
    pub fn new() -> Self {
        Self {}
    }

    #[wasm_bindgen]
    pub fn triangulate(&self, path_js: JsValue) -> RawTriangulation {
        let path_data = NestedData::with_json(path_js).unwrap();
        let raw = match path_data {
            NestedData::Contour(contour) => contour.triangulate(),
            NestedData::Shape(shape) => shape.triangulate(),
            NestedData::Shapes(shapes) => shapes.triangulate(),
        };

        RawTriangulation { raw }
    }

    #[wasm_bindgen]
    pub fn triangulate_with_points(&self, path_js: JsValue, points_js: JsValue) -> RawTriangulation {
        let points_data: Result<Vec<[f64; 2]>, _> = serde_wasm_bindgen::from_value(points_js);
        let points = points_data.unwrap();
        let path_data = NestedData::with_json(path_js).unwrap();
        let raw = match path_data {
            NestedData::Contour(contour) => contour.triangulate_with_steiner_points(&points),
            NestedData::Shape(shape) => shape.triangulate_with_steiner_points(&points),
            NestedData::Shapes(shapes) => shapes.triangulate_with_steiner_points(&points),
        };

        RawTriangulation { raw }
    }
}

#[wasm_bindgen]
impl RawTriangulation {
    #[wasm_bindgen]
    pub fn to_triangulation(&self) -> JsValue {
        let triangulation = self.raw.to_triangulation();
        serde_wasm_bindgen::to_value(&triangulation).unwrap()
    }

    #[wasm_bindgen]
    pub fn into_delaunay(self) -> Delaunay {
        Delaunay {
            delaunay: self.raw.into_delaunay(),
        }
    }
}

#[wasm_bindgen]
impl Delaunay {
    #[wasm_bindgen]
    pub fn to_triangulation(&self) -> JsValue {
        let triangulation = self.delaunay.to_triangulation();
        serde_wasm_bindgen::to_value(&triangulation).unwrap()
    }
}
