class Editor {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.txtInput = rootElement.querySelector('[ref=inputTxt]');
        this.txtButton = rootElement.querySelector('[ref=txtToJSON]');
        this.jsonInput = this.rootElement.querySelector('[ref=inputJSON]');
        this.jsonButton = this.rootElement.querySelector('[ref=jsonToTxt]');

        this.txtButton.addEventListener('click', (e) => {
            try {
                let text = this.txtInput.value;
                let p = new Parser();
                p.parse(text);
                this.jsonInput.value = JSON.stringify(p, null, 4);
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
            } catch (err) {
                this.txtInput.value = err.stack;
            }
        });
    }
}
