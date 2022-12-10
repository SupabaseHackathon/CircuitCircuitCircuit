import { Shape } from "./types";

export const animationFrameDebouncer = (callback: () => unknown) => {
    let updateRequested = false;

    return () => {
        if (updateRequested) return;
        updateRequested = true;

        requestAnimationFrame(() => {
            callback();
            updateRequested = false;
        });
    }
};

export const makeDraggable = (shape: Pick<Shape, "shapeEl" | "updatePosition">) => {
    const { shapeEl } = shape;
    shapeEl.setAttribute("draggable", "false");

    const curState = {
        x: 0,
        y: 0,
    }

    const initialOffset = {
        x: 0,
        y: 0,
    }

    const onMouseDown = ({ offsetX, offsetY, target }: MouseEvent) => {
        if ((target as HTMLElement)?.classList?.contains("input") || (target as HTMLElement)?.classList?.contains("output")) return;

        initialOffset.x = offsetX;
        initialOffset.y = offsetY;
        shapeEl.style.willChange = "transform";

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp, { once: true });
    };

    const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
        curState.x = clientX;
        curState.y = clientY;
        requestUpdate();
    };

    const onMouseUp = (e) => {
        window.removeEventListener("mousemove", onMouseMove);
        shapeEl.style.willChange = "initial";
    };

    const requestUpdate = animationFrameDebouncer(() => shape.updatePosition({
        x: curState.x - initialOffset.x,
        y: curState.y - initialOffset.y,
    }));

    shapeEl.addEventListener("mousedown", onMouseDown)
};