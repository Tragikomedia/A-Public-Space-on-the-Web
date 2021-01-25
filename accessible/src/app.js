import {UI} from './ui.js';

export class App {
    constructor(state, dispatch) {
        this.state = state;
        this.dispatch = dispatch;
        this.UI = new UI(state, dispatch);
    }
    syncState(state) {
        this.state = Object.assign({}, this.state, state);
        this.UI.updateState(this.state);
        document.querySelector('#manager').replaceWith(this.UI.dom);
    }
}