const {request} = require('http');

const makeRequest = function({method, path = '/', body = ''}) {
    request({
        hostname: "localhost",
        port: 8000,
        path: path,
        method: method
    }, response => {
        response.on("data", chunk => process.stdout.write(chunk.toString()));
    }).end(body);
}

exports.module = {
    makeRequest
}