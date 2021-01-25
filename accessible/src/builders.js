import {parentPath, processPath} from './helpers.js';

export function fileManager(state, dispatch) {
    let {results, path} = state;
    let {content, type} = results;
    
    let div = document.createElement("div");
    div.setAttribute('id', 'manager');
    let child = (type === "dir") ? fileList(dispatch, path, content) : editor({dispatch, path, content});
    div.appendChild(child);
    return div;
}

function fileList(dispatch, path, content) {
    let div = document.createElement("div");
    let ul = document.createElement("ul");
    // Tile used to go back
    if (path !== '/') {
        let backTile = listItem({dispatch, path: parentPath(path), item: ""}, true);
        ul.appendChild(backTile);
    }
    // Check if there are any items
    if (content[0]) {
        for (let item of content) {
            let li = listItem({dispatch, path, item});
            ul.appendChild(li);
        }
    }
    let neField = newEltField(path, dispatch);
    [ul, neField].forEach(el => div.appendChild(el));
    return div;
}

function editor({dispatch, path, content}) {
    let div = document.createElement("div");
    let textArea = document.createElement("textarea");
    textArea.value = content;
    let buttons = buttonRow({dispatch, path}, textArea);
    [textArea, buttons].forEach(el => div.appendChild(el));
    return div;
}

function listItem({dispatch, path, item}, goBack=false) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(goBack ? "/..." : item));
    li.addEventListener("click", () => {
        console.log("move");
        dispatch(processPath(path, item), "move");
    });

    if (!goBack) {
        let button = document.createElement("button");
        button.addEventListener("click", event => {
            event.stopPropagation();
            dispatch(processPath(path, item), "delete");
        })
        button.appendChild(document.createTextNode("Delete"));
        li.appendChild(button);
    }
    return li;
}

function newEltField(path, dispatch) {
    let div = document.createElement("div");
    let i = document.createElement("input");
    i.setAttribute("type", "text");
    let button = document.createElement("button");
    button.addEventListener("click", () => {
        let name = i.value;
        if (!name) name = "noname";
        dispatch(processPath(path, name), "create");
    });
    button.appendChild(document.createTextNode("Create"));
    [i, button].forEach(el => div.appendChild(el));
    return div;
}

function actionButton({dispatch, path, action, text}, elt) {
    let button = document.createElement("button");
    button.addEventListener("click", () => {
        dispatch(path, action, elt?.value);
    });
    button.appendChild(document.createTextNode(text));
    return button;
}

function buttonRow({dispatch, path}, elt) {
    let div = document.createElement("div");
    let backButton = actionButton({dispatch, path: parentPath(path), action: "move", text: "Back"});
    let resetButton = actionButton({dispatch, path, action: "move", text: "Reset"});
    let submitButton = actionButton({dispatch, path, action: "update", text: "Submit"}, elt);
    [backButton, resetButton, submitButton].forEach(el => div.appendChild(el));
    return div;
}