import {req} from './request_handler.js';

const fileReg = /\/[\w\s\.\-]+\.\w+$/;

function determineEndpoint(path) {
    if (fileReg.test(path)) return "file";
    return "dir";
}

async function updatedPathResults(path) {
    let content = await req.GET(path);
    let type = determineEndpoint(path);
    if (type === "dir") content = content.split('\n');
    return {content, type};
}

export async function createState(path, action, body) {
    let state = {
        results: {},
    }
    switch(action) {
        case "delete":
            await req.DELETE(path);
            path = parentPath(path);
            console.log("Deleted " + path);
            break;
        case "create":
            if (determineEndpoint(path) === "file") {
                await req.PUT(path, "");
            } else {
                await req.MKCOL(path);
            }
            console.log("Created file/dir at " + path);
            break;
        case "update":
            await req.PUT(path, body);
            console.log("Updated file at " + path);
            break;
        case "move":
        default:
            state.path = path;
            console.log("Moved to " + path)
            break;
    }
    let {content, type} = await updatedPathResults(path);
    state.results = {
        content,
        type
    };
    return state;
}

export function processPath(path, item) {
    return (path.length === 1) ? path + item : path + '/' + item;
}

export function parentPath(path) {
    let parentPath = path.slice(0, path.lastIndexOf('/'));
    if (!parentPath) parentPath += '/';
    return parentPath;
}