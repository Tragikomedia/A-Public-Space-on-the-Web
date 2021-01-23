const {sep} = require("path");

exports.notAllowed = (request) => {
    return {status: 405, body: `Method ${request.method} not allowed.`}
};

exports.urlPath = (cwd, dirName) => {
    const directory = cwd + sep + dirName;
    return (url) => {
        let path = directory + url;
        if (path !== directory && !path.startsWith(directory + sep)) throw {status: 403, body: "Forbidden"};
        return path;
    }
}

exports.pipeStream = (from, to) => {
    return new Promise((resolve, reject) => {
        from.on("error", reject);
        to.on("error", reject);
        to.on("finish", resolve);
        from.pipe(to);
    });
}