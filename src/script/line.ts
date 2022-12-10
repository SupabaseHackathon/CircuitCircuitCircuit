import { Input, Output } from "./inputOutput";

export const lines: Line[] = [];
const svgRoot = document.getElementById('svg-root')!;

export class Line {
    #start: Output;
    #end: Input;
    #lineEl: SVGPathElement;

    constructor({
        start,
        end,
        color,
    }: {
        start: Output;
        end: Input;
        color?: string;
    }) {
        this.#start = start;
        this.#end = end;


        this.#lineEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        this.#lineEl.setAttribute('stroke', color ?? 'white');
        this.#lineEl.setAttribute('stroke-width', '2');
        this.#lineEl.setAttribute('fill', 'transparent');
        this.#lineEl.style.pointerEvents = 'none';

        this.updatePath();
        svgRoot.appendChild(this.#lineEl);

        this.#start.line = this;
        this.#end.line = this;
    }

    updatePath() {
        const startPosition = this.#start.center;
        const endPosition = this.#end.center;

        const isReversed = startPosition.x > endPosition.x;
        const dx = Math.abs(endPosition.x - startPosition.x);
        const dy = Math.abs(endPosition.y - startPosition.y);
        const controlPointDistance = Math.max(
            10,
            isReversed ? dx : dx / 2,
            dy / 2,
        );

        const control1 = { x: startPosition.x + controlPointDistance, y: startPosition.y };
        const control2 = { x: endPosition.x - controlPointDistance, y: endPosition.y };

        this.#lineEl.setAttribute(
            "d",
            `M${startPosition.x} ${startPosition.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${endPosition.x} ${endPosition.y}`
          );
    }

    deleteLine() {
        this.#lineEl.remove();
        lines.splice(lines.indexOf(this), 1);
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    set start(newStart: Output) {
        this.#start.line = undefined;
        this.#start = newStart;
        this.#start.line = this;
        this.updatePath();
    }

    set end(newEnd: Input) {
        this.#end.line = undefined;
        this.#end = newEnd;
        this.#end.line = this;
        this.updatePath();
    }
}