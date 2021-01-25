import {App} from './src/app.js';
import { createState } from './src/helpers.js';
import {req} from './src/request_handler.js';


async function runWebsite() {
    let initialContent = await req.GET('/');
    initialContent = initialContent.split('\n');

    let state = {
        path: '/',
        results: {
            content: initialContent,
            type: 'dir',
        },
    };

    let app = new App(state, async function updateState(path, action, body) {
        let state = await createState(path, action, body);
        app.syncState(state);
    });
    document.body.appendChild(app.UI.dom);
}

runWebsite();