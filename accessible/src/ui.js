import {fileManager} from './builders.js';

export class UI {
    constructor(state, dispatch) {
        this.dispatch = dispatch;
        this.dom = fileManager(state, dispatch);
    }
    updateState(state) {
        this.dom = fileManager(state, this.dispatch);
    }
}
