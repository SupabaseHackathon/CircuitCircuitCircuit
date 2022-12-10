export type Position = {
    x: number;
    y: number;
};

export type Offset = Position;

export type Line = {
    updateStart: (newStart: Position) => void;
    updateEnd: (newEnd: Position) => void;
    deleteLine: () => void;
}

export type Shape = {
    updatePosition: (newPosition: Position) => void;
    deleteShape: () => void;
    shapeEl: HTMLDivElement;
    position: Position;
}

export type Require<T extends object, K extends keyof T = never> = Omit<T, K> & Required<Pick<T, K>>;
