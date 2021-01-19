const {createReadStream, createWriteStream} = require("fs");
const {mkdir, stat, readdir, rmdir, unlink} = require("fs").promises;
const {createServer} = require('http');

const {notAllowed, urlPath} = require('./server_helpers');

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
    return {body: createReadStream(path)}
}


createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;
    handler(request).catch(err => {
        if (err.status != null) return err;
        return {status: 500, body: String(error)};
    }).then(({body, status = 200, type="text/plain"}) => {
        response.writeHead(status, {"Content-Type": type});
        if (body && body.pipe) body.pipe(response);
        else response.end(body);
    })
})

