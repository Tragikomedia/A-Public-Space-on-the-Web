const {createReadStream, createWriteStream} = require("fs");
const {mkdir, stat, readdir, rmdir, unlink} = require("fs").promises;

const mime = require("mime");

const {urlPath, pipeStream} = require('./server_helpers');

const methods = Object.create(null);

const accessibleDir = "accessible";
const urlRoute = urlPath(process.cwd(), accessibleDir);

methods.GET = async (request) => {
    let path = urlRoute(request.url);
    let stats;
    try {
        stats = await stat(path);
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 404, body: "File not found"};
    }
    if (stats.isDirectory()) return {body: (await readdir(path)).join("\n")};
    return {body: createReadStream(path), type: mime.getType(path)};
}

methods.DELETE = async (request) => {
    let path = urlRoute(request.url);
    let stats;
    try {
        stats = await stat(path);
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 204};
    }
    if (stats.isDirectory()) await rmdir(path);
    else await unlink(path);
    return {status: 204};
}

methods.PUT = async function(request) {
    let path = urlRoute(request.url);
    await pipeStream(request, createWriteStream(path));
    return {status: 204};
}

methods.MKCOL = async function(request) {
    let path = urlRoute(request.url);
    let stats;
    try {
        stats = await stat(path)
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else {
            await mkdir(path);
            return {status: 204};
        }
    }
    if (stats.isDirectory()) return {status: 204};
    else return {status: 400, body: "Not a directory"};
}

methods.OPTIONS = async function() {
    return {status: 200};
}

module.exports = {
    methods,
}