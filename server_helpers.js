const {resolve, sep} = require("path");
const {parse} = require("url");

exports.notAllowed = (request) => {
    return {status: 405, body: `Method ${request.method} not allowed.`}
};

exports.urlPath = (cwd, dirName) => {
    const directory = cwd + sep + dirName;
    return (url) => {
        let {pathName} = parse(url);
        let path = resolve(decodeURIComponent(pathName).slice(1));
        if (path !== directory && !path.startsWith(directory + sep)) throw {status: 403, body: "Forbidden"};
        return path;
    }
}