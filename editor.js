const RIGHT_TRACE = 0b0001;
const TOP_TRACE = 0b0010;
const LEFT_TRACE = 0b0100;
const BOTTOM_TRACE = 0b1000;

class Editor {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.txtInput = rootElement.querySelector('[ref=inputTxt]');
        this.txtButton = rootElement.querySelector('[ref=txtToJSON]');
        this.jsonInput = rootElement.querySelector('[ref=inputJSON]');
        this.jsonButton = rootElement.querySelector('[ref=jsonToTxt]');
        this.renderButton = rootElement.querySelector('[ref=render]');
        this.traceRenderer = rootElement.querySelector('[ref=traceRenderer]');
        this.renderOutput = rootElement.querySelector('[ref=renderOutput]');

        this.txtInput.value = this.loadFromLocalStorage('txtInput.value');
        this.jsonInput.value = this.loadFromLocalStorage('jsonInput.value');
        if (this.jsonInput.value) {
            this.renderJSON();
        }

        this.txtInput.addEventListener('input', (e) => {
            this.saveToLocalStorage('txtInput.value', this.txtInput.value);
            this.parseTxt();
        });

        this.jsonInput.addEventListener('input', (e) => {
            this.saveToLocalStorage('jsonInput.value', this.jsonInput.value);
            this.formatJSON();
        });

        this.txtButton.addEventListener('click', (e) => {
            this.parseTxt();
            e.preventDefault();
        });

        this.jsonButton.addEventListener('click', (e) => {
            this.formatJSON();
            e.preventDefault();
        });

        this.renderButton.addEventListener('click', (e) => {
            this.renderJSON();
            e.preventDefault();
        });

        this._isDown = false;

        this.traceRenderer.addEventListener('mouseup', (e) => {
            this._isDown = false;
        });

        this.traceRenderer.addEventListener('mouseout', (e) => {
            this._isDown = false;
        });

        this.traceRenderer.addEventListener('mousemove', (e) => {
            if (!this._isDown) { return }

            let rect = e.target.getClientRects()[0];
            let x = Math.floor(e.offsetX * e.target.width / rect.width / CELL_SIZE);
            let y = Math.floor(e.offsetY * e.target.height / rect.height / CELL_SIZE);
            this.updateDraw(x, y);
        });

        this.traceRenderer.addEventListener('mousedown', (e) => {
            let rect = e.target.getClientRects()[0];
            let x = Math.floor(e.offsetX * e.target.width / rect.width / CELL_SIZE);
            let y = Math.floor(e.offsetY * e.target.height / rect.height / CELL_SIZE);
            this.startDraw(x, y);
        });
    }

    startDraw(x, y) {
        this._isDown = true;
        this._startX = x;
        this._startY = y;
    }

    updateDraw(x, y) {
        let x1 = this._startX;
        let y1 = this._startY;

        let dX = x - x1;
        let dY = y - y1;
        let dist =  Math.abs(Math.sqrt(dX * dX + dY * dY));
        if (dist !== 1) { return }

        this._startX = x;
        this._startY = y;

        let json = this.getJSON();
        if (!json) { return }

        if (dX > 0) {
            // left to right
            json.traces[y1][x1] = json.traces[y1][x1] ^ RIGHT_TRACE;
            json.traces[y][x] = json.traces[y][x] ^ LEFT_TRACE;
        } else if (dX < 0) {
            // right to left
            json.traces[y1][x1] = json.traces[y1][x1] ^ LEFT_TRACE;
            json.traces[y][x] = json.traces[y][x] ^ RIGHT_TRACE;
        } else if (dY > 0) {
            // top to bottom
            json.traces[y1][x1] = json.traces[y1][x1] ^ BOTTOM_TRACE;
            json.traces[y][x] = json.traces[y][x] ^ TOP_TRACE;
        } else if (dY < 0) {
            // bottom to top
            json.traces[y1][x1] = json.traces[y1][x1] ^ TOP_TRACE;
            json.traces[y][x] = json.traces[y][x] ^ BOTTOM_TRACE;
        }

        this.setJSON(json);
        this.formatJSON();
    }

    getJSON() {
        try {
            let text = this.jsonInput.value;
            return JSON.parse(text);
        } catch (err) {
            // TODO
        }
    }

    setJSON(json) {
        try {
            let text = JSON.stringify(json, null, 4);
            this.jsonInput.value = text;
            this.saveToLocalStorage('jsonInput.value', this.jsonInput.value);
        } catch (err) {
            // TODO
        }
    }

    parseTxt() {
        try {
            let text = this.txtInput.value;
            let p = new Parser();
            p.parse(text);
            this.setJSON(p);
            this.renderJSON();
        } catch (err) {
            this.jsonInput.value = err.stack;
        }
    }

    formatJSON() {
        try {
            let json = this.getJSON();
            let f = new Formatter();
            f.format(json);
            this.txtInput.value = f.output;
            this.saveToLocalStorage('txtInput.value', this.txtInput.value);
            this.renderJSON();
        } catch (err) {
            this.txtInput.value = err.stack;
        }
    }

    renderJSON() {
        try {
            let text = this.jsonInput.value;
            let json = JSON.parse(text);
            let r = new Renderer(this.traceRenderer);
            r.render(json);
            this.renderOutput.textContent = '';
        } catch (err) {
            this.renderOutput.textContent = err.stack;
        }
    }

    loadFromLocalStorage(key) {
        try {
            return localStorage[key] || '';
        } catch (err) {
            return '';
        }
    }

    saveToLocalStorage(key, value) {
        try {
            localStorage[key] = value;
        } catch (err) {
            console.warn(err);
        }
    } 
}
