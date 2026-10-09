import init, {WebApp} from './overlay_editor.js';

let app: WebApp | null = null;

function showError(message: string): void {
    const warning = document.getElementById('unsupported-warning');
    const details = document.getElementById('overlay-editor-error');
    const status = document.getElementById('overlay-editor-status');
    const canvas = document.getElementById('overlay-editor-canvas');
    if (details) details.textContent = message;
    if (warning) warning.hidden = false;
    if (status) status.hidden = true;
    if (canvas) canvas.hidden = true;
}

function destroyApp(): void {
    if (app) {
        app.destroy();
        app.free();
        app = null;
    }
}

async function loadText(name: string): Promise<string> {
    const url = new URL(`./tests/${name}_tests.json`, import.meta.url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load ${name} examples: ${response.status} ${response.statusText}`);
    }
    return response.text();
}

async function run(): Promise<void> {
    const canvas = document.getElementById('overlay-editor-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('The editor canvas could not be found.');
    }
    if (!('gpu' in navigator)) {
        showError('Your browser does not support WebGPU. Open this editor in a browser with WebGPU enabled.');
        return;
    }

    await init();
    const [booleanData, stringData, strokeData, variableStrokeData, outlineData] = await Promise.all([
        loadText('boolean'),
        loadText('string'),
        loadText('stroke'),
        loadText('variable_stroke'),
        loadText('outline'),
    ]);
    app = new WebApp();
    await app.start(booleanData, stringData, strokeData, variableStrokeData, outlineData);
    const status = document.getElementById('overlay-editor-status');
    if (status) status.hidden = true;
}

window.addEventListener('pagehide', (event: PageTransitionEvent) => {
    if (!event.persisted) destroyApp();
});

void run().catch((error: unknown) => {
    destroyApp();
    console.error('Overlay Editor could not start:', error);
    showError(error instanceof Error ? error.message : String(error));
});
