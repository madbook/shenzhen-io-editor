let MULTILINE_FIELDS = { traces: 1, code: 1 };

class Formatter {
    constructor() {
        this.output = '';
        this.listPrefixes = [];
    }

    format(parsedObj) {
        try {
            this.formatRootObject(parsedObj);
        } catch (err) {
            let formatErr = new Error(`Error during formatting: ${err.message}`);
            formatErr.name = "FormatterError";
            throw formatErr;
        }
    }

    formatRootObject(parsedObj) {
        if (!parsedObj.name) {
            throw new Error('Missing required field "name".');
        }

        this.writeField(parsedObj, 'name', true);
        this.writeField(parsedObj, 'puzzle', true);
        this.writeField(parsedObj, 'production-cost');
        this.writeField(parsedObj, 'power-usage');
        this.output += '\n';
        this.writeField(parsedObj, 'traces', true);
        this.output += '\n';
        this.writeField(parsedObj, 'chip');
    }

    writeListPrefixes() {
        for (let i = 0; i < this.listPrefixes.length; i++) {
            this.output += `[${this.listPrefixes[i]}] \n`;
        }
    }

    writeObject(parsedObj, name) {
        for (let field in parsedObj) {
            this.writeField(parsedObj, field);
        }
        this.output += '\n\n';
    }

    writeField(parsedObj, name, required) {
        if (name in parsedObj) {
            let value = parsedObj[name];
            let type = this.getFormatType(name, value);

            if (type === 'value') {
                this.output += `[${name}] ${value}\n`;
            } else if (type === 'multiline') {
                this.output += `[${name}] \n${value}\n`;
            } else if (type === 'scope') {
                this.output += `[${name}] \n`;
            } else if (type === 'list') {
                this.listPrefixes.push(name);
                for (let i = 0; i < value.length; i++) {
                    this.writeListPrefixes()
                    this.writeObject(value[i], name);
                }
                this.listPrefixes.pop();
            }
        } else if (required) {
            throw new Error(`Missing required field "${name}".`);
        }
    }

    getFormatType(name, value) {
        let type = typeof value;
        if (type === 'object' && Array.isArray(value)) {
            return 'list';
        } else if (type === 'object' && value) {
            return 'scope';
        } else if (name in MULTILINE_FIELDS) {
            return 'multiline';
        } else {
            return 'value';
        }
    }
}