use i_triangle::float::delaunay::Delaunay;
use i_triangle::float::uniform::UniformTriangulatable;
use i_triangle::i_overlay::i_float::adapter::FloatPointAdapter;
use i_triangle::i_overlay::i_shape::source::float::resource::ShapeResource;
use wasm_bindgen::JsError;

pub(super) fn uniform_mesh<S>(shape: &S, edge_length: f64) -> Result<Delaunay<[f64; 2]>, JsError>
where
    S: ShapeResource<[f64; 2]>,
{
    if shape
        .iter_paths()
        .flatten()
        .any(|point| !point[0].is_finite() || !point[1].is_finite())
    {
        return Err(JsError::new("coordinates must be finite"));
    }
    let adapter = FloatPointAdapter::<[f64; 2], i32>::with_iter_conservative(shape.iter_paths().flatten());
    if adapter.round_len_to_int(edge_length) <= 1 {
        return Err(JsError::new(
            "edge_length is below the precision of the integer engine",
        ));
    }
    Ok(shape.uniform_triangulate(edge_length))
}
