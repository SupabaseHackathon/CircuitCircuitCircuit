import { OutputStates, InputStates } from "./base/not";
import { ComponentData, ConnectionData, InputName, nameToId, OutputName, UUID, XORData } from "./sampleData";

const observe = Symbol("observe");
const unobserve = Symbol("unobserve");

type Observable<T extends Record<string | symbol | number, any>> = T & {
	[observe]: (observer: () => void) => void,
	[unobserve]: (observer: () => void) => void,
}
const observable = <T extends Record<string | symbol | number, any>>(obj: T) => {
	const observers: (() => void)[] = [];
	(obj as any)[observe] = (observer: () => void) => observers.push(observer);
	(obj as any)[unobserve] = (observer: () => void) => observers.filter(o => o !== observer);

	return new Proxy(obj, {
		set: (target, key, value) => {
			const changed = target[key] !== value;
			(target as any)[key] = value;

			if (changed) observers.forEach(observer => observer());

			return true;
		}
	}) as Observable<T>;
}

class Connection<TFrom extends OutputName, TTo extends InputName> {
	#from;
	// #to;

	constructor({ from, to }: {
		from: {
			component: Component,
			key: TFrom,
		},
		to: {
			key: TTo,
			component: Component,
		},
	}) {
		this.#from = from;

		console.log(from.component.name, from.key, to.component.name, to.key);
		to.component.inputs[to.key] = from.component.outputs[from.key];
		console.log("use Wire", from.component.outputs[from.key], from.component, from.key);
		from.component.outputs[observe](() => {
			to.component.inputs[to.key] = from.component.outputs[from.key];
		});

	}

	get isActive() {
		return this.#from.component.outputs[this.#from.key];
	}
}

abstract class Component<TInputs extends OutputName = OutputName, TOutputs extends InputName = InputName> {
	protected abstract _inputs: OutputStates<TInputs>;
	protected abstract _outputs: Observable<InputStates<TOutputs>>;
	protected _subComponents: Component[] = [];
	protected _connections: Connection<TInputs, TOutputs>[] = [];
    private _lockedInputs: typeof this._inputs | undefined;
	protected _name: string = "unnamed";

	get inputs() {
		return this._inputs;
	}

	get outputs() {
		return this._outputs;
	}

	get subComponents() {
		return this._subComponents;
	}

	get connections() {
		return this._connections;
	}

	get name() {
		return this._name;
	}

	protected abstract _step(lockedInputs: typeof this._inputs): void;

    step() {
        if (!this._lockedInputs) throw new Error(`"${this.constructor.name}" not locked`);
        this._step(this._lockedInputs);
		this._lockedInputs = undefined;
    }


	lock() {
        this._lockedInputs = Object.freeze(structuredClone(this._inputs));
    };
}

type MetaData = {
	name: string,
	x: number,
	y: number,
}

export class CustomComponent extends Component {
	_inputs;
	_outputs;

    constructor(componentData: ComponentData, meta?: MetaData) {
		super();
		console.log(meta);
		this._name = meta?.name ?? "CustomComponent without name"; // TODO: add name

        this._inputs = Object.fromEntries(componentData.componentOutputs.map(key => [key, false]));
        this._outputs = observable(Object.fromEntries(componentData.componentInputs.map(key => [key, false])));

		this._subComponents = componentData.components.map(({ id, ...meta }) => createComponent(id, meta));
		this._connections = componentData.connections.map(({ from, to }) => new Connection({
			from: {
				component: from.component !== undefined ? this._subComponents[from.component] : this,
				key: from.output,
			},
			to: {
				component: to.component !== undefined ? this._subComponents[to.component] : this,
				key: to.input,
			}
		}));
    }

	_step(lockedInputs: typeof this._inputs) {

        this.subComponents.forEach(component => component.lock());
        this.subComponents.forEach(component => component.step());
	}
}

export class Input extends Component<never, OutputName> {
	_inputs;
	_outputs;

	constructor(inputs: OutputName[]) {
		super();
		this._inputs = {};
		this._outputs = observable(Object.fromEntries(inputs.map(key => [key, false])));
		this._name = "Input";
	}

	_step(lockedInputs: typeof this._inputs) {
		throw new Error("This method should not be called");
	}
}

export class Output extends Component<InputName, never> {
	_inputs;
	_outputs;

	constructor(inputs: InputName[]) {
		super();
		this._inputs = Object.fromEntries(inputs.map(key => [key, false]));
		this._outputs = observable({});
		this._name = "Output";
	}

	_step(lockedInputs: typeof this._inputs) {
		throw new Error("This method should not be called");
	}
}

class Not extends Component<"A", "Output"> {
	_inputs;
	_outputs;

	constructor(meta?: MetaData) {
		super();
		this._inputs = { A: false };
		this._outputs = observable({ Output: false });
		this._name = meta?.name ?? "Not";
	}

	_step(lockedInputs: typeof this._inputs) {
		this._outputs["Output"] = !lockedInputs["A"];
	}
}

class And extends Component<"A" | "B", "Output"> {
	_inputs;
	_outputs;

	constructor(meta?: MetaData) {
		super();
		this._inputs = { A: false, B: false };
		this._outputs = observable({ Output: false });
		this._name = meta?.name ?? "And";
	}

	_step(lockedInputs: typeof this._inputs) {
		console.log("and step", this._outputs["Output"], lockedInputs["A"], lockedInputs["B"]);
		this._outputs["Output"] = lockedInputs["A"] && lockedInputs["B"];
	}
}

class Or extends Component<"A" | "B", "Output"> {
	_inputs;
	_outputs;

	constructor(meta?: MetaData) {
		super();
		this._inputs = { A: false, B: false };
		this._outputs = observable({ Output: false });
		this._name = meta?.name ?? "Or";
	}

	_step(lockedInputs: typeof this._inputs) {
		this._outputs["Output"] = lockedInputs["A"] || lockedInputs["B"];
	}
}

const createComponent = (id: UUID, meta?: MetaData) => {
	switch (id) {
		case nameToId["not"]:
			return new Not(meta);
		case nameToId["or"]:
			return new Or(meta);
		case nameToId["and"]:
			return new And(meta);
		default:
			const componentData: ComponentData = null as unknown as ComponentData; // TODO Implement getting from server
			return new CustomComponent(componentData, meta);
	}
};

const XOR = new CustomComponent(XORData, { name: "XOR" } as unknown as MetaData);

XOR.outputs["A"] = false;
XOR.outputs["B"] = true;

for (let i = 0; i < 20; i++) {
    XOR.lock();
    XOR.step();
}

console.log("Result:", XOR.inputs["Output"]);
console.log(XOR);
