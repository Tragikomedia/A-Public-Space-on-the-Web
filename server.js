const {createServer} = require('http');

const methods = Object.create(null);

const notAllowed = (request) => {
    return {status: 405, body: `Method ${request.method} not allowed.`}
}

createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;
})

