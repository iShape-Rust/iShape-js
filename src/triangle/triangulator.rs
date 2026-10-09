use super::relaxation::{relaxation_options, relaxation_result, RelaxationOptionsJs, RelaxationResultJs};
use super::uniform::uniform_mesh;
use crate::data::{ContourDataJs, NestedData, PathDataJs, ShapeDataJs, TriangulationDataJs};
use alloc::vec::Vec;
use i_triangle::float::delaunay::Delaunay as RustDelaunay;
use i_triangle::float::triangulatable::Triangulatable;
use i_triangle::float::triangulation::{RawTriangulation as RustRawTriangulation, Triangulation};
use wasm_bindgen::prelude::{wasm_bindgen, JsError};

#[wasm_bindgen]
pub struct RawTriangulation {
    raw: RustRawTriangulation<[f64; 2]>,
}

#[wasm_bindgen]
pub struct Delaunay {
    delaunay: RustDelaunay<[f64; 2]>,
}

#[wasm_bindgen]
pub struct Triangulator {}

#[wasm_bindgen]
impl Triangulator {
    #[wasm_bindgen(constructor)]
    pub fn create() -> Self {
        Self {}
    }

    /// Builds a Delaunay mesh with a target edge length, splitting boundaries
    /// and adding interior grid points. Accepts a contour, shape, or shapes.
    /// edge_length must be finite, positive, and above the integer precision.
    #[wasm_bindgen]
    pub fn uniform_triangulate(&self, path_js: PathDataJs, edge_length: f64) -> Result<Delaunay, JsError> {
        if !edge_length.is_finite() || edge_length <= 0.0 {
            return Err(JsError::new("edge_length must be finite and positive"));
        }
        let path_data: NestedData = serde_wasm_bindgen::from_value(path_js.into())
            .map_err(|error| JsError::new(&alloc::format!("{error}")))?;
        let delaunay = match path_data {
            NestedData::Contour(contour) => uniform_mesh(&contour, edge_length)?,
            NestedData::Shape(shape) => uniform_mesh(&shape, edge_length)?,
            NestedData::Shapes(shapes) => uniform_mesh(&shapes, edge_length)?,
        };
        Ok(Delaunay { delaunay })
    }

    #[wasm_bindgen]
    pub fn triangulate(&self, path_js: PathDataJs) -> RawTriangulation {
        let path_data = NestedData::with_json(path_js).unwrap();
        let raw = match path_data {
            NestedData::Contour(contour) => contour.triangulate(),
            NestedData::Shape(shape) => shape.triangulate(),
            NestedData::Shapes(shapes) => shapes.triangulate(),
        };

        RawTriangulation { raw }
    }

    #[wasm_bindgen]
    pub fn triangulate_with_points(&self, path_js: PathDataJs, points_js: ContourDataJs) -> RawTriangulation {
        let points_data: Result<Vec<[f64; 2]>, _> = serde_wasm_bindgen::from_value(points_js.into());
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
    pub fn to_triangulation(&self) -> TriangulationDataJs {
        let triangulation: Triangulation<[f64; 2], usize> = self.raw.to_triangulation();
        serde_wasm_bindgen::to_value(&triangulation).unwrap().into()
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
    /// Moves interior vertices toward centroid-net area centroids in place.
    /// Boundary and hole vertices stay fixed. Omitted options use 8 iterations
    /// and zero tolerance. Invalid options throw before modifying the mesh.
    #[wasm_bindgen]
    pub fn relax_mut(&mut self, options: Option<RelaxationOptionsJs>) -> Result<RelaxationResultJs, JsError> {
        let options = relaxation_options(options)?;
        relaxation_result(self.delaunay.relax_mut(options))
    }

    #[wasm_bindgen]
    pub fn to_triangulation(&self) -> TriangulationDataJs {
        let triangulation: Triangulation<[f64; 2], usize> = self.delaunay.to_triangulation();
        serde_wasm_bindgen::to_value(&triangulation).unwrap().into()
    }

    #[wasm_bindgen]
    pub fn to_convex_polygons(&self) -> ShapeDataJs {
        let polygons = self.delaunay.to_convex_polygons();
        serde_wasm_bindgen::to_value(&polygons).unwrap().into()
    }

    #[wasm_bindgen]
    pub fn refine_with_circumcenters(&mut self, min_area: f64) {
        self.delaunay.refine_with_circumcenters_mut(min_area);
    }

    #[wasm_bindgen]
    pub fn refine_with_circumcenters_by_obtuse_angle(&mut self, min_area: f64) {
        self.delaunay
            .refine_with_circumcenters_by_obtuse_angle_mut(min_area);
    }

    #[wasm_bindgen]
    pub fn to_centroid_net(&self, min_area: f64) -> ShapeDataJs {
        let centroids = self.delaunay.to_centroid_net(min_area);
        serde_wasm_bindgen::to_value(&centroids).unwrap().into()
    }
}
