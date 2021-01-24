export function fileManager(state, dispatch) {
    let {results, path} = state;
    let {content, type} = results;
    
    let div = document.createElement("div");
    div.setAttribute('id', 'manager');
    let child = (type === "dir") ? fileList(dispatch, path, content) : editor(content);
    div.appendChild(child);
    return div;
}

function processPath(path, item) {
    return (path.length === 1) ? path + item : path + '/' + item;
}

function parentPath(path) {
    let parentPath = path.slice(0, path.lastIndexOf('/'));
    if (!parentPath) parentPath += '/';
    return parentPath;
}

function fileList(dispatch, path, content) {
    let ul = document.createElement("ul");
    //USE PARENT PATH TO GET GO BACK FUNCTIONALITY
    for (let item of content) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(item));
        li.addEventListener("click", () => {
            dispatch(processPath(path, item), "move");
        });
        ul.appendChild(li);
    }
    return ul;
}

function editor(content) {
    let textArea = document.createElement("textarea");
    textArea.value = content;
    return textArea;
}