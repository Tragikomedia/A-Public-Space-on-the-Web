const makeRequest = async function(params) {
    let {method, path} = params;
    let basicParams = {
        method: method,
        headers: {
            'Content-Type': 'text/plain'
        }
    }
    if (method==="PUT") basicParams = Object.assign({}, basicParams, {body: params.body});
    let results;
    try {
        results = await fetch(`http://localhost:8000${path}`, basicParams);
    } catch (error) {
        console.log(error);
    }
    return results.text() ?? "Error";
}

export const req = Object.create(null);

req.GET = (path) => {
    return makeRequest({method: "GET", path});
} 
req.PUT = (path, body) => {
    return makeRequest({method: "PUT", path, body});
} 
req.DELETE = (path) => {
    return makeRequest({method: "DELETE", path});
} 
req.MKCOL = (path) => {
    return makeRequest({method: "MKCOL", path});
} 
