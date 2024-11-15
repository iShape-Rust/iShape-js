import init, {WebApp} from './overlay_editor.js';

async function run() {
    await init();
    console.log('wasm module loaded');

    const booleanData = await fetch('./tests_boolean.json').then((res) => res.text());
    const stringData = await fetch('./tests_string.json').then((res) => res.text());
    console.log('json files loaded');

    const app = new WebApp();
    console.log('WebApp starting');
    app.start(booleanData, stringData);
}

run();