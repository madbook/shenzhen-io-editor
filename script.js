class ParserScope {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
        this.fields = {};
    }

    toJSON() {
        return this.fields;
    }
}

const FIELD_PATTERN = /^\[([a-z\-]+)\]\ (.+)?$/;

class Parser {
    constructor() {
        this.mode = 'parse';
        this.scope = new ParserScope(null, 'root');
        this.rootScope = this.scope;
    }

    toJSON() {
        return this.rootScope.toJSON();
    }

    closeScope() {
        if (this.mode === 'capture_or_new_scope') {
            throw new Error('Scope closed without any defined fields.');
        }

        if (this.mode === 'capture') {
            this.mode = 'parse';
            let value = this.scope.fields.$capture.join('\n');
            let fieldName = this.scope.name;
            this.scope = this.scope.parent;
            this.scope.fields[fieldName] = value;
        } else if (this.scope !== this.rootScope) {
            this.scope = this.scope.parent;
        }
    }

    captureLine(line) {
        if (this.mode === 'capture_or_new_scope') {
            this.mode = 'capture';
            this.scope.fields.$capture = [];
        }

        this.scope.fields.$capture.push(line);
    }

    parseValue(value) {
        try {
            return JSON.parse(value);
        } catch (err) {
            return value;
        }
    }

    defineField(name, value) {
        if (this.mode === 'capture_or_new_scope') {
            this.mode = 'parse';
        }

        if (this.mode !== 'parse') {
            throw new Error(`Unexpected field definition of [${name}] outside of parse mode.`);
        }

        if (value) {
            value = this.parseValue(value);
            this.scope.fields[name] = value;
        } else {
            this.mode = 'capture_or_new_scope';
            let newScope = new ParserScope(this.scope, name);
            if (this.scope.fields[name]) {
                if (Array.isArray(this.scope.fields[name])) {
                    this.scope.fields[name].push(newScope);
                } else {
                    this.scope.fields[name] = [this.scope.fields[name], newScope];
                }
            } else {
                this.scope.fields[name] = newScope;
            }
            this.scope = newScope;
        }
    }

    parse(inputText) {
        let lines = inputText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            try {
                this.parseLine(lines[i]);
            } catch (err) {
                throw new Error(`Error during "${this.mode}" on line ${i + 1}: ${err.message}`);
            }
        }

        while (this.scope !== this.rootScope) {
            this.closeScope();
        }
    }

    parseLine(line) {
        var match = line.match(FIELD_PATTERN);

        if (!line.length) {
            this.closeScope();
        } else if (!match) {
            this.captureLine(line);
        } else {
            this.defineField(match[1], match[2]);
        }
    }
}

class Editor {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.input = this.rootElement.querySelector('[ref=input]');
        this.output = this.rootElement.querySelector('[ref=output]');
        this.parseButton = this.rootElement.querySelector('[ref=submit]');

        this.parseButton.addEventListener('click', (e) => {
            try {
                let text = this.input.value;
                let p = new Parser();
                p.parse(text);
                this.output.textContent = JSON.stringify(p, null, 4);
            } catch (err) {
                this.output.textContent = err.stack;
            }
            e.preventDefault();
        });
    }
}

let editor = new Editor(document.querySelector('.editor'));