// Build the web bindings first, then run: node --test tests/triangle_relaxation.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import init, { Triangulator } from '../pkg/ishape_wasm.js';
import { tests as demoTests } from '../docs-gen/src/js/triangle/triangulation_data.js';

await init({ module_or_path: await readFile(new URL('../pkg/ishape_wasm_bg.wasm', import.meta.url)) });

const outer = [[0, 0], [100, 0], [100, 100], [0, 100]];
const hole = [[40, 40], [40, 60], [60, 60], [60, 40]];
const interior = [[25, 35], [72, 42], [43, 79]];

function withMesh(shape, run) {
    const triangulator = new Triangulator();
    const mesh = triangulator.triangulate_with_points(shape, interior).into_delaunay();
    triangulator.free();
    try {
        run(mesh);
    } finally {
        mesh.free();
    }
}

function area({ points, indices }) {
    let sum = 0;
    for (let i = 0; i < indices.length; i += 3) {
        const [a, b, c] = indices.slice(i, i + 3).map(index => points[index]);
        const triangle = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / 2;
        assert.ok(Number.isFinite(triangle) && triangle > 0);
        sum += triangle;
    }
    return sum;
}

function cellArea(points) {
    let twiceArea = 0;
    for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        twiceArea += a[0] * b[1] - b[0] * a[1];
    }
    return Math.abs(twiceArea) / 2;
}

test('relaxation moves interior vertices and preserves outer and hole boundaries', () => {
    for (const shape of [outer, [outer, hole]]) {
        withMesh(shape, mesh => {
            const before = mesh.to_triangulation();
            const boundary = shape === outer ? outer : [...outer, ...hole];
            const fixed = before.points.flatMap((point, index) =>
                boundary.some(p => p[0] === point[0] && p[1] === point[1]) ? [index] : []);
            assert.equal(fixed.length, boundary.length);
            const result = mesh.relax_mut({ maxIterations: 2 });
            assert.equal(result.iterations, 2);
            assert.equal(typeof result.converged, 'boolean');
            const after = mesh.to_triangulation();
            assert.equal(after.points.length, before.points.length);
            fixed.forEach(index => assert.deepEqual(after.points[index], before.points[index]));
            assert.ok(after.points.some((p, i) => !fixed.includes(i) && (p[0] !== before.points[i][0] || p[1] !== before.points[i][1])));
            assert.ok(Math.abs(area(after) - (shape === outer ? 10000 : 9600)) < 1e-4);
            assert.ok(mesh.to_centroid_net(0).length > 0);
            assert.ok(mesh.to_convex_polygons().length > 0);
        });
    }
});

test('zero iterations and a large tolerance leave the mesh unchanged', () => {
    withMesh(outer, mesh => {
        const before = mesh.to_triangulation();
        assert.equal(mesh.relax_mut({ maxIterations: 0 }).iterations, 0);
        assert.deepEqual(mesh.to_triangulation(), before);
        assert.deepEqual(mesh.relax_mut({ maxIterations: 24, tolerance: 1000 }), { iterations: 0, converged: true });
        assert.deepEqual(mesh.to_triangulation(), before);
    });
});

test('omitted options match the upstream defaults', () => {
    withMesh(outer, a => withMesh(outer, b => {
        assert.deepEqual(a.relax_mut(), b.relax_mut({ maxIterations: 8, tolerance: 0 }));
        assert.deepEqual(a.to_triangulation(), b.to_triangulation());
    }));
});

test('invalid options throw without changing or consuming the mesh', () => {
    withMesh(outer, mesh => {
        const before = mesh.to_triangulation();
        for (const options of [
            { maxIterations: -1 }, { maxIterations: 1.5 }, { maxIterations: 2 ** 32 },
            { maxIterations: Infinity }, { maxIterations: '24' },
            { tolerance: -1 }, { tolerance: NaN }, { tolerance: Infinity },
            { max_iterations: 24 },
        ]) {
            assert.throws(() => mesh.relax_mut(options));
            assert.deepEqual(mesh.to_triangulation(), before);
        }
        assert.equal(mesh.relax_mut({ maxIterations: 1 }).iterations, 1);
    });
});

test('uniform triangulation splits boundaries, respects holes, and scales with edge length', () => {
    const triangulator = new Triangulator();
    try {
        const dense = triangulator.uniform_triangulate(outer, 10);
        const coarse = triangulator.uniform_triangulate(outer, 25);
        try {
            const before = dense.to_triangulation();
            assert.ok(before.points.length > coarse.to_triangulation().points.length);
            assert.ok(before.points.some(([x, y]) => y === 0 && x > 0 && x < 100));
            const fixed = before.points.flatMap(([x, y], i) => x === 0 || x === 100 || y === 0 || y === 100 ? [i] : []);
            dense.relax_mut({ maxIterations: 24 });
            const after = dense.to_triangulation();
            fixed.forEach(i => assert.deepEqual(after.points[i], before.points[i]));
            assert.ok(Math.abs(area(after) - 10000) < 1e-4);
        } finally {
            dense.free();
            coarse.free();
        }
        const other = outer.map(([x, y]) => [x + 200, y]);
        for (const [path, expected] of [[[outer, hole], 9600], [[[outer, hole], [other]], 19600]]) {
            const mesh = triangulator.uniform_triangulate(path, 10);
            try {
                mesh.relax_mut({ maxIterations: 24 });
                const triangles = mesh.to_triangulation();
                assert.ok(Math.abs(area(triangles) - expected) < 1e-4);
                assert.ok(triangles.points.every(([x, y]) => x <= 40 || x >= 60 || y <= 40 || y >= 60));
                const cellsArea = mesh.to_centroid_net(0).reduce((sum, cell) => sum + cellArea(cell), 0);
                assert.ok(Math.abs(cellsArea - expected) < 1e-4);
            } finally {
                mesh.free();
            }
        }
    } finally {
        triangulator.free();
    }
});

test('uniform triangulation rejects invalid lengths and inputs without trapping WASM', () => {
    const triangulator = new Triangulator();
    try {
        for (const length of [0, -1, NaN, Infinity, 1e-16]) {
            assert.throws(() => triangulator.uniform_triangulate(outer, length));
        }
        for (const path of [null, {}, 'shape', [[0, 0], [100, Infinity], [0, 100]]]) {
            assert.throws(() => triangulator.uniform_triangulate(path, 10));
        }
        const mesh = triangulator.uniform_triangulate(outer, 10);
        assert.ok(Math.abs(area(mesh.to_triangulation()) - 10000) < 1e-4);
        mesh.free();
    } finally {
        triangulator.free();
    }
});

test('all Tessellation fixtures preserve triangle and centroid coverage in both subdivision modes', () => {
    const triangulator = new Triangulator();
    try {
        for (const fixture of demoTests) {
            const reference = triangulator.triangulate(fixture.shapes).into_delaunay();
            const expectedArea = area(reference.to_triangulation());
            reference.free();
            for (const { uniform, size, relaxed } of [false, true].flatMap(uniform =>
                [10, 40, 100].flatMap(size => [false, true].map(relaxed => ({ uniform, size, relaxed }))))) {
                const mesh = uniform
                    ? triangulator.uniform_triangulate(fixture.shapes, size)
                    : triangulator.triangulate(fixture.shapes).into_delaunay();
                try {
                    if (!uniform) mesh.refine_with_circumcenters(size * size);
                    if (relaxed) assert.ok(mesh.relax_mut({ maxIterations: 24 }).iterations <= 24);
                    assert.ok(Math.abs(area(mesh.to_triangulation()) - expectedArea) < Math.max(1e-4, expectedArea * 1e-6), fixture.name);
                    const cells = mesh.to_centroid_net(0);
                    const cellsArea = cells.reduce((sum, cell) => sum + cellArea(cell), 0);
                    assert.ok(Math.abs(cellsArea - expectedArea) < Math.max(1e-4, expectedArea * 1e-6), `${fixture.name}: centroid cells must cover the complete shape`);
                    assert.ok(mesh.to_convex_polygons().length > 0);
                } finally {
                    mesh.free();
                }
            }
        }
    } finally {
        triangulator.free();
    }
});
