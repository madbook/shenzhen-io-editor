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

        this.txtInput.addEventListener('input', (e) => {
            this.saveToLocalStorage('txtInput.value', this.txtInput.value);
        });

        this.jsonInput.addEventListener('input', (e) => {
            this.saveToLocalStorage('jsonInput.value', this.jsonInput.value);
        });

        this.txtButton.addEventListener('click', (e) => {
            try {
                let text = this.txtInput.value;
                let p = new Parser();
                p.parse(text);
                this.jsonInput.value = JSON.stringify(p, null, 4);
                this.saveToLocalStorage('jsonInput.value', this.jsonInput.value);
            } catch (err) {
                this.jsonInput.value = err.stack;
            }
            e.preventDefault();
        });

        this.jsonButton.addEventListener('click', (e) => {
            try {
                let text = this.jsonInput.value;
                let json = JSON.parse(text);
                let f = new Formatter();
                f.format(json);
                this.txtInput.value = f.output;
                this.saveToLocalStorage('txtInput.value', this.txtInput.value);
            } catch (err) {
                this.txtInput.value = err.stack;
            }
            e.preventDefault();
        });

        this.renderButton.addEventListener('click', (e) => {
            try {
                let text = this.jsonInput.value;
                let json = JSON.parse(text);
                let r = new Renderer();
                r.render(json, this.traceRenderer);
            } catch (err) {
                this.renderOutput.textContent = err.stack;
            }
            e.preventDefault();
        });
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
