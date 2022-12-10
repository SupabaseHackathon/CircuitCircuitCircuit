import { animationFrameDebouncer } from "./draggable";
import { Line } from "./line";
import { Offset, Position, Require, Shape } from "./types";

let onInputOutputClick: ((clickedInput: InputOutput) => void) | undefined;

class InputOutput {
    #name: string;
    #line: Line | undefined;
    #shape: Shape | undefined;
    #parentOffset: Offset = { x: 0, y: 0 };
    #shapeOffset: Offset = { x: 0, y: 0 };
    #InputOutputEl: HTMLDivElement;

    constructor({
        name,
        line,
        shape,
        type,
    }: {
        name?: string;
        line?: Line;
        shape?: Shape;
        type: "input" | "output";
    }) {
        this.#name = name ?? "";
        this.#line = line;
        this.#shape = shape;

        this.#InputOutputEl = document.createElement("div");
        this.#InputOutputEl.classList.add(type);

        this.#InputOutputEl.addEventListener("dblclick", ({ clientX, clientY }: MouseEvent) => {
            let freeInputOutput: InputOutput;

            if (type === "input") {
                freeInputOutput = new FreeOutput();

                this.#line = new Line({
                    start: freeInputOutput,
                    end: this as unknown as Input,
                });
            } else {
                freeInputOutput = new FreeInput();

                this.#line = new Line({
                    start: this as unknown as Output,
                    end: freeInputOutput,
                });
            }


            freeInputOutput.setPosition({
                x: clientX,
                y: clientY,
            });

            onInputOutputClick = (input) => {
                this.#line!.end = input;
                freeInputOutput.delete();
            }
        });

        this.#InputOutputEl.addEventListener("mouseup", (e) => {
            if (e.button !== 0) return;

            if (onInputOutputClick) onInputOutputClick(this);
            onInputOutputClick = undefined;
        });

        requestAnimationFrame(() => this.updatePosition());

    }

    delete() {
        this.#InputOutputEl.remove();

        if (!this.#line) return;
        this.#line.deleteLine();
    }

    updatePosition() {
        this.#parentOffset.x = this.#InputOutputEl.offsetLeft;
        this.#parentOffset.y = this.#InputOutputEl.offsetTop;

        if (!this.#line) return;
        this.#line.updatePath();
    }

    setPosition(newOffset: Offset) {
        this.#shapeOffset = newOffset;
        this.updatePosition();
    }

    get name() {
        return this.#name;
    }

    get line() {
        return this.#line;
    }

    get shape() {
        return this.#shape;
    }

    get parentOffset() {
        return this.#parentOffset;
    }

    get shapeOffset() {
        return this.#shapeOffset;
    }

    get InputOutputEl() {
        return this.#InputOutputEl;
    }

    set parentEl(newParentEl: HTMLElement) {
        newParentEl.appendChild(this.#InputOutputEl);
    }

    set line(line: Line | undefined) {
        this.#line = line;
    }
}

class BoundInputOutput extends InputOutput {
    constructor(args: Require<ConstructorParameters<typeof InputOutput>[0], "shape">) {
        super(args);
    }

    get center(): Position {
        return {
            x: this.shape.position.x + super.parentOffset.x + super.InputOutputEl.offsetWidth / 2,
            y: this.shape.position.y + super.parentOffset.y + super.InputOutputEl.offsetHeight / 2,
        }
    }

    get shape() {
        return super.shape!;
    }
}

class FreeInputOutput extends InputOutput {
    #abortController = new AbortController();
    #eventPosition: Position = { x: 0, y: 0 };
    #requestUpdate: () => void;

    constructor(args: ConstructorParameters<typeof InputOutput>[0]) {
        super(args);

        this.#requestUpdate = animationFrameDebouncer(() => this.setPosition(this.#eventPosition));
        window.addEventListener("mousemove", this.#onMouseMove.bind(this), { signal: this.#abortController.signal });
    }

    delete() {
        this.#abortController.abort();
        super.delete();
    }

    #onMouseMove({ clientX, clientY }: MouseEvent) {
        this.#eventPosition.x = clientX;
        this.#eventPosition.y = clientY;

        this.#requestUpdate();
    }

    get center(): Position {
        return {
            x: super.shapeOffset.x + super.InputOutputEl.offsetWidth / 2,
            y: super.shapeOffset.y + super.InputOutputEl.offsetHeight / 2,
        }
    }
}

export class BoundInput extends BoundInputOutput {
    constructor(args: Omit<ConstructorParameters<typeof BoundInputOutput>[0], "type">) {
        super({ ...args, type: "input" });
    }
}

export class BoundOutput extends BoundInputOutput {
    constructor(args: Require<Omit<ConstructorParameters<typeof BoundInputOutput>[0], "type">, "shape">) {
        super({ ...args, type: "output" });
    }
}

export class FreeOutput extends FreeInputOutput {
    constructor(args: Omit<ConstructorParameters<typeof FreeInputOutput>[0], "type"> = {}) {
        super({ ...args, type: "output" });
    }
}

export class FreeInput extends FreeInputOutput {
    constructor(args: Omit<ConstructorParameters<typeof FreeInputOutput>[0], "type"> = {}) {
        super({ ...args, type: "input" });
    }
}

export type Output = BoundOutput | FreeOutput;
export type Input = BoundInput | FreeInput;