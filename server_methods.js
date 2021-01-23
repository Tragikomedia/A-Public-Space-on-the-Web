const {createReadStream, createWriteStream} = require("fs");
const {mkdir, stat, readdir, rmdir, unlink} = require("fs").promises;

const mime = require("mime");

const {urlPath} = require('./server_helpers');

const methods = Object.create(null);

const accessibleDir = "accessible";
const urlRoute = urlPath(process.cwd(), accessibleDir);

methods.GET = async (request) => {
    let path = urlRoute(request.url);
    let stats;
    try {
        stats = await stat(path);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        else return {status: 404, body: "File not found"};
    }
    if (stats.isDirectory()) return {body: (await readdir(path)).join("\n")};
    return {body: createReadStream(path), type: mime.getType(path)};
}

module.exports = {
    methods,
}