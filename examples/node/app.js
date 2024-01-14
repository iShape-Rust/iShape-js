console.log(__dirname);

console.log(module.paths);

const { Overlay, OverlayGraph, OverlayRule, ShapeType, FillRule } = require('i_shape');

// Sample polygons
const subjPolygon = {"paths": [{"points": [[200, 300], [200, 100], [400, 100], [400, 300]]}]};
const clipPolygon = {"paths": [{"points": [[300, 400], [300, 200], [500, 200], [500, 400]]}]};

// Function to perform union operation
function performUnion(subj, clip) {
    const overlay = new Overlay();
    overlay.add_shape(subj, ShapeType.Subject);
    overlay.add_shape(clip, ShapeType.Clip);

    const graph = overlay.build_graph(FillRule.EvenOdd);
    const union = graph.extract_shapes(OverlayRule.Union);

    return union;
}

// Perform operation and log result
const result = performUnion(subjPolygon, clipPolygon);
console.log("Union Result:", JSON.stringify(result, null, 2));
