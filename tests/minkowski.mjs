import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import init, { FillRule, minkowski_difference, minkowski_sum } from '../pkg/ishape_wasm.js';
import { createMinkowskiShape, minkowskiPresets } from '../docs-gen/src/js/triangle/minkowski_data.js';

await init({ module_or_path: await readFile(new URL('../pkg/ishape_wasm_bg.wasm', import.meta.url)) });

function rectangle(minX, minY, maxX, maxY) {
    return [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]];
}

function area(shapes) {
    return shapes.reduce((sum, shape) => sum + Math.abs(shape.reduce((sum, contour) => {
        return sum + contour.reduce((sum, [x, y], i) => {
            const [nx, ny] = contour[(i + 1) % contour.length];
            return sum + x * ny - nx * y;
        }, 0) / 2;
    }, 0)), 0);
}

function bounds(shapes) {
    const points = shapes.flat(2);
    assert.ok(points.length > 0);
    assert.ok(points.every(point => point.length === 2 && point.every(Number.isFinite)));
    return [
        Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])),
        Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1])),
    ];
}

function close(actual, expected) {
    assert.ok(Math.abs(actual - expected) < 1e-5, `${actual} != ${expected}`);
}

test('sum and difference accept every pair of PathData forms and preserve their inputs', () => {
    const a = rectangle(1, 2, 4, 6);
    const b = rectangle(-2, -1, 0, 2);
    for (const lhs of [a, [a], [[a]]]) {
        for (const rhs of [b, [b], [[b]]]) {
            const before = structuredClone([lhs, rhs]);
            const sum = minkowski_sum(lhs, rhs, FillRule.NonZero);
            const difference = minkowski_difference(lhs, rhs, FillRule.NonZero);
            bounds(sum).forEach((value, i) => close(value, [-1, 1, 4, 8][i]));
            bounds(difference).forEach((value, i) => close(value, [1, 0, 6, 7][i]));
            close(area(sum), 35);
            close(area(difference), 35);
            assert.deepEqual([lhs, rhs], before);
        }
    }
});

test('difference reflects the second operand and is order dependent', () => {
    const a = [[0, 0], [4, 0], [0, 3]];
    const b = [[1, 1], [3, 1], [1, 2]];
    const ab = minkowski_difference(a, b, FillRule.NonZero);
    const ba = minkowski_difference(b, a, FillRule.NonZero);
    const reflected = b.map(([x, y]) => [-x, -y]);
    assert.deepEqual(ab, minkowski_sum(a, reflected, FillRule.NonZero));
    assert.notDeepEqual(ab, ba);
    close(area(ab), area(ba));
    bounds(ab).forEach((value, i) => close(value, [-3, -2, 3, 2][i]));
});

test('filled regions preserve a shrinking hole and disconnected components', () => {
    const frame = [rectangle(-5, -5, 5, 5), rectangle(-3, -3, 3, 3).reverse()];
    const kernel = rectangle(-1, -1, 1, 1);
    for (const operation of [minkowski_sum, minkowski_difference]) {
        const result = operation(frame, kernel, FillRule.NonZero);
        assert.equal(result.length, 1);
        assert.equal(result[0].length, 2);
        close(area(result), 128);
    }
    const disconnected = [[rectangle(0, 0, 2, 2)], [rectangle(10, 0, 12, 2)]];
    const result = minkowski_sum(disconnected, rectangle(0, 0, 1, 1), FillRule.NonZero);
    assert.equal(result.length, 2);
    close(area(result), 18);
});

test('fill rules and empty or degenerate regions are respected', () => {
    const square = rectangle(0, 0, 2, 2);
    for (const operation of [minkowski_sum, minkowski_difference]) {
        for (const empty of [[], [[]], [[[]]], [[0, 0]], [[0, 0], [1, 0]]]) {
            assert.deepEqual(operation(square, empty, FillRule.NonZero), []);
            assert.deepEqual(operation(empty, square, FillRule.NonZero), []);
        }
        assert.deepEqual(operation([square, square], square, FillRule.EvenOdd), []);
        close(area(operation([square, square], square, FillRule.NonZero)), 16);
    }
});

test('invalid paths and numeric coordinates throw without trapping later WASM calls', () => {
    const square = rectangle(0, 0, 2, 2);
    for (const operation of [minkowski_sum, minkowski_difference]) {
        for (const invalid of [null, {}, 'shape', [[0, 0], [1]], [[0, 0, 1]],
            ...[NaN, Infinity, -Infinity, Number.MAX_VALUE].map(x => [[0, 0], [x, 1], [1, 0]])]) {
            assert.throws(() => operation(invalid, square, FillRule.NonZero), Error);
            assert.throws(() => operation(square, invalid, FillRule.NonZero), Error);
        }
        close(area(operation(square, square, FillRule.NonZero)), 16);
    }
});

test('all demo preset pairs and edits of outer and hole vertices produce valid geometry', () => {
    for (const presetA of minkowskiPresets) {
        for (const presetB of minkowskiPresets) {
            const a = createMinkowskiShape(presetA.id, 'a');
            const b = createMinkowskiShape(presetB.id, 'b');
            for (const operation of [minkowski_sum, minkowski_difference]) {
                const result = operation(a, b, FillRule.NonZero);
                const [minX, minY, maxX, maxY] = bounds(result);
                assert.ok(minX >= -9 && maxX <= 9 && minY >= -7 && maxY <= 7);
                assert.ok(area(result) > 0);
            }
        }
    }
    const a = createMinkowskiShape('frame', 'a');
    const b = createMinkowskiShape('triangle', 'b');
    const before = minkowski_sum(a, b, FillRule.NonZero);
    a[1][0][0] += 0.3;
    b[0][0][1] -= 0.4;
    const after = minkowski_sum(a, b, FillRule.NonZero);
    assert.notDeepEqual(after, before);
    assert.ok(area(after) > 0);
    bounds(after);
});
