const {createServer} = require('http');

const {notAllowed} = require('./server_helpers');
const {methods} = require('./server_methods');

const port = 8000;

createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;
    handler(request).catch(err => {
        if (err.status != null) return err;
        return {status: 500, body: String(err)};
    }).then(({body, status = 200, type="text/plain"}) => {
        response.writeHead(status, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT, GET, MKCOL, OPTIONS, DELETE'});
        if (body && body.pipe) body.pipe(response);
        else response.end(body);
    })
}).listen(port);

