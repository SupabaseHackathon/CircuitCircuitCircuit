type States<T extends string> = {
    [P in T]: boolean;
};

export type InputStates<T extends string = string> = States<T>;
export type OutputStates<T extends string = string> = States<T>;

const output = (Output: boolean): OutputStates<"Output"> => ({
    Output,
});

export const Not = (inputs: InputStates<"A">) => output(!inputs["A"]);
export const Or = (inputs: InputStates<"A" | "B">) => output(inputs["A"] || inputs["B"]);
export const And = (inputs: InputStates<"A" | "B">) => output(inputs["A"] && inputs["B"]);

class Component {
    constructor() {
    }
}
