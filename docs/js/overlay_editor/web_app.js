import init, {WebApp} from './overlay_editor.js';

async function run() {
    await init();
    console.log('wasm module loaded');

    const booleanData = await fetch('./tests_boolean.json').then((res) => res.text());
    const stringData = await fetch('./tests_string.json').then((res) => res.text());
    const strokeData = await fetch('./tests_stroke.json').then((res) => res.text());
    const outlineData = await fetch('./tests_outline.json').then((res) => res.text());
    console.log('json files loaded');

    const app = new WebApp();
    console.log('WebApp starting');
    app.start(booleanData, stringData, strokeData, outlineData);
}

run();
