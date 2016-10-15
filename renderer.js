const CELL_SIZE = 20;
const TRACE_WIDTH = 5;
const TRACE_COLOR = 'cyan';
const TRACE_BACKGROUND = 'darkslateblue';

class Renderer {
    render(state, canvas) {
        try {
            this._render(state, canvas);
        } catch (err) {
            err.name = "RendererError";
            throw err;
        }
    }

    _render(state, canvas) {
        this.renderTraces(state, canvas);
    }

    renderTraces(state, canvas) {
        let traces = state.traces;
        if (!traces === undefined) {
            throw new Error('Cannot render traces because no "traces" attribute was found');
        }

        let ctx = canvas.getContext('2d');
        let lines = traces.split('\n');

        canvas.width = lines[0].length * CELL_SIZE;
        canvas.height = lines.length * CELL_SIZE;

        ctx.fillStyle = TRACE_BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = TRACE_WIDTH;
        ctx.lineCap = 'round';
        ctx.strokeStyle = TRACE_COLOR;
        ctx.fillStyle = TRACE_COLOR;

        for (let y = 0; y < lines.length; y++) {
            let line = lines[y];
            for (let x = 0; x < line.length; x++) {
                let trace = line[x];
                if (trace === '.') {
                    continue;
                } else {
                    this.drawTrace(ctx, x, y, trace);
                }
            }
        }
    }

    drawTrace(ctx, x, y, trace) {
        let h = CELL_SIZE / 2;
        let tX = x * CELL_SIZE + h;
        let tY = y * CELL_SIZE + h;
        ctx.translate(tX, tY);

        switch (trace) {
            case '1':
                // center to right
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(h, 0);
                ctx.stroke();
                break;
            case '2':
                // top to center
                ctx.beginPath();
                ctx.moveTo(0, -h);
                ctx.lineTo(0, 0);
                ctx.stroke();
                break;
            case '3':
                // top to right
                ctx.beginPath();
                ctx.moveTo(0, -h);
                ctx.lineTo(h, 0);
                ctx.stroke();
                break;
            case '4':
                // center to left
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-h, 0);
                ctx.stroke();
                break;
            case '5':
                // left to right
                ctx.beginPath();
                ctx.moveTo(-h, 0);
                ctx.lineTo(h, 0);
                ctx.stroke();
                break;
            case '6':
                // top to left
                ctx.beginPath();
                ctx.moveTo(0, -h);
                ctx.lineTo(-h, 0);
                ctx.stroke();
                break;
            case '7':
                // T junction pointing up
                ctx.beginPath();
                ctx.moveTo(-h, 0);
                ctx.lineTo(h, 0);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -h);
                ctx.stroke();
                break;
            case '8':
                // center to bottom
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, h);
                ctx.stroke();
                break;
            case '9':
                // bottom to right
                ctx.beginPath();
                ctx.moveTo(0, h);
                ctx.lineTo(h, 0);
                ctx.stroke();
                break;
            case 'A':
                // top to bottom
                ctx.beginPath();
                ctx.moveTo(0, -h);
                ctx.lineTo(0, h);
                ctx.stroke();
                break;
            case 'B':
                // T junction pointing right
                ctx.beginPath();
                ctx.moveTo(0, -h);
                ctx.lineTo(0, h);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(h, 0);
                ctx.stroke();
                break;
            case 'C':
                // left to bottom
                ctx.beginPath();
                ctx.moveTo(-h, 0);
                ctx.lineTo(0, h);
                ctx.stroke();
                break;
            case 'D':
                // T junction pointing down
                ctx.beginPath();
                ctx.moveTo(-h, 0);
                ctx.lineTo(h, 0);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, h);
                ctx.stroke();
                break;
            case 'E':
                // T junction pointing left
                ctx.beginPath();
                ctx.moveTo(0, -h);
                ctx.lineTo(0, h);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-h, 0);
                ctx.stroke();
                break;
            case 'F':
                // + junction
                ctx.beginPath();
                ctx.moveTo(0, -h);
                ctx.lineTo(0, h);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-h, 0);
                ctx.lineTo(h, 0);
                ctx.stroke();
                break;
            default:
                ctx.fillRect(-h, -h, CELL_SIZE, CELL_SIZE);
        }

        ctx.translate(-tX, -tY);
    }
}
