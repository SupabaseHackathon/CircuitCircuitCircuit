import { makeDraggable } from "./draggable";
import { BoundInput, BoundOutput } from "./inputOutput";
import { Position } from "./types";

const PER_INPUT_OUTPUT_HEIGHT = 20;
const shapes: Shape[] = [];
const shapeRoot = document.getElementById('shape-root')!;

export class Shape {
    #inputs: BoundInput[] = [];
    #outputs: BoundOutput[] = [];
    #shapeEl: HTMLDivElement;
    #inputRoot: HTMLDivElement;
    #outputRoot: HTMLDivElement;
    #position: Position = { x: 0, y: 0 };

    constructor({
        position,
        inputs,
        outputs,
        color,
    }: {
        position: Position;
        inputs: string[];
        outputs: string[];
        color?: string;
    }) {
        this.#shapeEl = document.createElement("div");
        this.#shapeEl.classList.add("shape");
        this.#shapeEl.style.backgroundColor = color ?? "white";

        // this.#updateHeight();
        this.updatePosition(position);

        this.#inputRoot = document.createElement("div");
        this.#outputRoot = document.createElement("div");
        this.#inputRoot.classList.add("input-root");
        this.#outputRoot.classList.add("output-root");
        this.#shapeEl.appendChild(this.#inputRoot);
        this.#shapeEl.appendChild(this.#outputRoot);

        inputs.forEach(this.addInput.bind(this));
        outputs.forEach(this.addOutput.bind(this));

        makeDraggable(this);
        shapes.push(this);
        shapeRoot.appendChild(this.#shapeEl);
    }

    updatePosition(newPosition: Position) {
        this.#position.x = newPosition.x;
        this.#position.y = newPosition.y;
        this.#shapeEl.style.setProperty("--x", this.#position.x + "px");
        this.#shapeEl.style.setProperty("--y", this.#position.y + "px");

        this.#inputs.forEach(input => input.updatePosition());
        this.#outputs.forEach(output => output.updatePosition());
    }

    deleteShape() {
        this.#shapeEl.remove();
        shapes.splice(shapes.indexOf(this), 1);
    }

    addInput(name: string) {
        const newInput = new BoundInput({
            name,
            shape: this,
        });

        this.#inputs.push(newInput);
        newInput.parentEl = this.#inputRoot;
        // this.#updateHeight();
    }

    addOutput(name: string) {
        const newOutput = new BoundOutput({
            name,
            shape: this,
        });

        this.#outputs.push(newOutput);
        newOutput.parentEl = this.#outputRoot;

        requestAnimationFrame(() => this.#outputs.forEach(output => output.updatePosition()));
        // this.#updateHeight();
    }

    // #updateHeight = () => {
    //     this.#shapeEl.style.height = this.height + "px";
    // };

    // get height() {
    //     return Math.min(
    //         this.#inputs.length,
    //         this.#outputs.length
    //     ) * PER_INPUT_OUTPUT_HEIGHT + PER_INPUT_OUTPUT_HEIGHT;
    // }

    get shapeEl() {
        return this.#shapeEl;
    }

    get position() {
        return this.#position;
    }

    get inputs() {
        return this.#inputs;
    }

    get outputs() {
        return this.#outputs;
    }
}
