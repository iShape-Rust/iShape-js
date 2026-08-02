import init, { WebApp } from './overlay_editor.js';
async function loadText(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load ${url}: ${response.status} ${response.statusText}`);
    }
    return response.text();
}
async function run() {
    await init();
    console.log('wasm module loaded');
    const [booleanData, stringData, strokeData, outlineData] = await Promise.all([
        loadText('./../js/overlay_editor/tests/boolean_tests.json'),
        loadText('./../js/overlay_editor/tests/string_tests.json'),
        loadText('./../js/overlay_editor/tests/stroke_tests.json'),
        loadText('./../js/overlay_editor/tests/outline_tests.json'),
    ]);
    console.log('json files loaded');
    const app = new WebApp();
    console.log('WebApp starting');
    app.start(booleanData, stringData, strokeData, outlineData);
    console.log('WebApp started');
}
void run();
//# sourceMappingURL=web_app.js.map