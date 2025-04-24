import init, {WebApp} from './overlay_editor.js';

async function run() {
    await init();
    console.log('wasm module loaded');

    const booleanData = await fetch('./../js/overlay_editor/tests/boolean_tests.json').then((res) => res.text());
    const stringData = await fetch('./../js/overlay_editor/tests/string_tests.json').then((res) => res.text());
    const strokeData = await fetch('./../js/overlay_editor/tests/stroke_tests.json').then((res) => res.text());
    const outlineData = await fetch('./../js/overlay_editor/tests/outline_tests.json').then((res) => res.text());
    console.log('json files loaded');

    const app = new WebApp();
    console.log('WebApp starting');
    app.start(booleanData, stringData, strokeData, outlineData);
    console.log('WebApp started');
}

run();