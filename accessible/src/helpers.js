import {req} from './request_handler.js';

const fileReg = /\/[\w\s\.\-]+\.\w+$/;

function determineEndpoint(path) {
    if (fileReg.test(path)) return "file";
    return "dir";
}

export async function createState(path, action) {
    let state = {
        path: path,
        results: {},
    }
    switch(action) {
        case "move":
            let results = await req.GET(path);
            let type = determineEndpoint(path);
            if (type === "dir") results = results.split('\n');
            state.results = {
                content: results,
                type
            };
            break;
        default:
            console.log("wrong");
            break;
    }
    return state;
}