use alloc::vec::Vec;
use core::fmt;
use i_triangle::i_overlay::i_float::adapter::FloatPointAdapter;
use i_triangle::i_overlay::vector::edge::VectorEdge;
use wasm_bindgen::prelude::wasm_bindgen;

pub type ShapesData = Vec<ShapeData>;
pub type ShapeData = Vec<ContourData>;
pub type ContourData = Vec<[f64; 2]>;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "PathData")]
    pub type PathDataJs;
    #[wasm_bindgen(typescript_type = "ContourData")]
    pub type ContourDataJs;
    #[wasm_bindgen(typescript_type = "ShapeData")]
    pub type ShapeDataJs;
    #[wasm_bindgen(typescript_type = "ShapesData")]
    pub type ShapesDataJs;
    #[wasm_bindgen(typescript_type = "TriangulationData")]
    pub type TriangulationDataJs;
    #[wasm_bindgen(typescript_type = "SeparatedVectors")]
    pub type SeparatedVectorsJs;
}

#[wasm_bindgen(typescript_custom_section)]
const PATH_DATA_TYPE: &'static str = r#"
export type PathData = ContourData | ShapeData | ShapesData;
export type ContourData = [number, number][];
export type ShapeData = ContourData[];
export type ShapesData = ShapeData[];

/** The result of triangulation, containing the points and the triangles formed by those points. */
export type TriangulationData = {
    /** Each pair of numbers represents the x and y coordinates of a point. */
    points: [number, number][];
    /** Each group of three numbers represents the indices of the points that form a triangle. */
    triangles: number[];
};

export type SeparatedVectors = {
    vectors: {
        ax: number;
        ay: number;
        bx: number;
        by: number;
        fill: number;
    }[]
};"#;

#[derive(serde::Deserialize)]
#[serde(untagged)]
pub(super) enum NestedData {
    Contour(ContourData),
    Shape(ShapeData),
    Shapes(ShapesData),
}

impl NestedData {
    pub(super) fn with_json(data: PathDataJs) -> Option<Self> {
        let nested_data: Result<NestedData, _> = serde_wasm_bindgen::from_value(data.into());
        nested_data.ok()
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct VectorData {
    pub ax: f64,
    pub ay: f64,
    pub bx: f64,
    pub by: f64,
    pub fill: u8,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct VectorsData {
    pub vectors: Vec<VectorData>,
}

impl VectorsData {
    pub(super) fn create(vectors: Vec<VectorEdge>, adapter: &FloatPointAdapter<[f64; 2]>) -> Self {
        let mut list = Vec::with_capacity(vectors.len());
        for vector in vectors.into_iter() {
            let a = adapter.int_to_float(&vector.a);
            let b = adapter.int_to_float(&vector.b);
            let fill = vector.fill;

            list.push(VectorData {
                ax: a[0],
                ay: a[1],
                bx: b[0],
                by: b[1],
                fill,
            });
        }
        Self { vectors: list }
    }
}

impl fmt::Display for NestedData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            NestedData::Contour(data) => write!(f, "Contour: {:?}]", data),
            NestedData::Shape(data) => write!(f, "Shape: {:?}]", data),
            NestedData::Shapes(data) => write!(f, "Shapes: {:?}]", data),
        }
    }
}
