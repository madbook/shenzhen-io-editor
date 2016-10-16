const CELL_SIZE = 20;
const TRACE_WIDTH = 5;
const GRID_COLOR = 'slateblue';
const TRACE_COLOR = 'cyan';
const TRACE_BACKGROUND = 'darkslateblue';

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    render(state) {
        try {
            this._render(state);
        } catch (err) {
            err.name = "RendererError";
            throw err;
        }
    }

    _render(state) {
        this.renderTraces(state);
    }

    renderTraces(state) {
        let traces = state.traces;
        if (traces === undefined) {
            throw new Error('Cannot render traces because no "traces" attribute was found');
        }

        let canvas = this.canvas;
        let ctx = this.ctx;

        canvas.width = traces[0].length * CELL_SIZE;
        canvas.height = traces.length * CELL_SIZE;

        ctx.fillStyle = TRACE_BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = GRID_COLOR;

        for (let y = 0; y < traces.length; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(canvas.width, y * CELL_SIZE);
            ctx.stroke();
        }

        for (let x = 0; x < traces[0].length; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, canvas.height);
            ctx.stroke();
        }

        ctx.lineWidth = TRACE_WIDTH;
        ctx.lineCap = 'round';
        ctx.strokeStyle = TRACE_COLOR;
        ctx.fillStyle = TRACE_COLOR;

        for (let y = 0; y < traces.length; y++) {
            let line = traces[y];
            for (let x = 0; x < line.length; x++) {
                let trace = line[x];
                if (trace) {
                    this.drawTrace(x, y, trace);
                }
            }
        }
    }

    drawTrace(x, y, trace) {
        let ctx = this.ctx;
        let h = CELL_SIZE / 2;
        let tX = x * CELL_SIZE + h;
        let tY = y * CELL_SIZE + h;
        ctx.translate(tX, tY);

        // BLTR - bottom, left, top, right

        let bottom = !!(trace & 0b1000);
        let left = !!(trace & 0b0100);
        let top = !!(trace & 0b0010);
        let right = !!(trace & 0b0001);


        if (left || right) {
            ctx.beginPath();
            ctx.moveTo(left ? -h : 0, 0);
            ctx.lineTo(right ? h : 0, 0);
            ctx.stroke();
        }

        if (top || bottom) {
            ctx.beginPath();
            ctx.moveTo(0, top ? -h : 0);
            ctx.lineTo(0, bottom ? h : 0);
            ctx.stroke();
        }

        ctx.translate(-tX, -tY);
    }
}
