import { OutputStates, InputStates } from "./base/not";
import { ComponentData, ConnectionData, InputName, nameToId, OutputName, UUID, XORData } from "./sampleData";

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
		// this.#to = to;

		Object.defineProperty(from.component.outputs, from.key, {
			set: () => {
				to.component.inputs[to.key] = from.component.outputs[from.key];
			}
		})
	}

	get isActive() {
		return this.#from.component.outputs[this.#from.key];
	}
}

abstract class Component<TInputs extends OutputName = OutputName, TOutputs extends InputName = InputName> {
	protected abstract _inputs: OutputStates<TInputs>;
	protected abstract _outputs: InputStates<TOutputs>;
	protected _subComponents: Component[] = [];
	protected _connections: Connection<TInputs, TOutputs>[] = [];

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

	abstract step(): void;
}

export class CustomComponent extends Component {
	_inputs;
	_outputs;

    constructor(componentData: ComponentData, meta?: unknown) {
		super();
        this._inputs = Object.fromEntries(componentData.componentInputs.map(key => [key, false]));
        this._outputs = Object.fromEntries(componentData.componentOutputs.map(key => [key, false]));

		this._subComponents = componentData.components.map(({ id, ...meta }) => createComponent(id, meta));
		this._connections = componentData.connections.map(({ from, to }) => new Connection({
			from: {
				component: from.component ? this._subComponents[from.component] : this,
				key: from.output,
			},
			to: {
				component: to.component ? this._subComponents[to.component] : this,
				key: to.input,
			}
		}));
    }

	step() {
		throw new Error("Method not implemented.");
	}
}

export class Input extends Component<never, OutputName> {
	_inputs;
	_outputs;

	constructor(inputs: OutputName[]) {
		super();
		this._inputs = {};
		this._outputs = Object.fromEntries(inputs.map(key => [key, false]));
	}

	step() {
		throw new Error("Method not implemented.");
	}
}

export class Output extends Component<InputName, never> {
	_inputs;
	_outputs;

	constructor(inputs: InputName[]) {
		super();
		this._inputs = Object.fromEntries(inputs.map(key => [key, false]));
		this._outputs = {};
	}

	step() {
		throw new Error("Method not implemented.");
	}
}

class Not extends Component<"A", "Output"> {
	_inputs;
	_outputs;

	constructor(meta?: unknown) {
		super();
		this._inputs = { A: false };
		this._outputs = { Output: false };
	}

	step() {
		this._outputs["Output"] = !this._inputs["A"];
	}
}

class And extends Component<"A" | "B", "Output"> {
	_inputs;
	_outputs;

	constructor(meta?: unknown) {
		super();
		this._inputs = { A: false, B: false };
		this._outputs = { Output: false };
	}

	step() {
		this._outputs["Output"] = this._inputs["A"] && this._inputs["B"];
	}
}

class Or extends Component<"A" | "B", "Output"> {
	_inputs;
	_outputs;

	constructor(meta?: unknown) {
		super();
		this._inputs = { A: false, B: false };
		this._outputs = { Output: false };
	}

	step() {
		this._outputs["Output"] = this._inputs["A"] || this._inputs["B"];
	}
}

const createComponent = (id: UUID, meta?: unknown) => {
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

const XOR = new CustomComponent(XORData);
