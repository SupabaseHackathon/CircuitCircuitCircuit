export type UUID = string;
export type InputName = string;
export type OutputName = string;
export type ComponentIndex = number;

// 0 = not
// 1 = and
// 2 = or

export const nameToId = {
    not: 'NOT00000-0000-0000-0000-000000000000',
    and: 'AND00000-0000-0000-0000-000000000000',
    or: 'OR00000-0000-0000-0000-000000000000',
}

export type ConnectionData = {
	from: {
		component?: ComponentIndex,
		output: OutputName,
	},
	to: {
		component?: ComponentIndex,
		input: InputName,
	},
}

export type ComponentData = {
    components: {
        id: UUID,
		name: string,
        x: number,
        y: number,
    }[],
    componentInputs: OutputName[], // from the view of the component, an input to the component is an output
    componentOutputs: InputName[],
    connections: ConnectionData[],
}

export const simulateGetComponentDataById = (id: UUID) => {
	return {
		'XOR00000-0000-0000-0000-000000000000': XORData,
	}[id];
};

export const XORData: ComponentData = {
    components: [
        {
			id: nameToId["and"],
			name: "And_1",
			x: 0,
			y: 0
		},
        {
			id: nameToId["or"],
			name: "Or",
			x: 0,
			y: 0
		},
        {
			id: nameToId["not"],
			name: "Not",
			x: 0,
			y: 0
		},
        {
			id: nameToId["and"],
			name: "And_2",
			x: 0,
			y: 0
		},
    ],
    componentInputs: ["A", "B"],
    componentOutputs: ["Output"],
    connections: [
        {
            from: {
                output: "A"
            },
            to: {
                component: 0,
                input: "A"
            }
        },
        {
            from: {
                output: "B"
            },
            to: {
                component: 0,
                input: "B"
            }
        },
        {
            from: {
                output: "A"
            },
            to: {
                component: 1,
                input: "A"
            }
        },
        {
            from: {
                output: "B"
            },
            to: {
                component: 1,
                input: "B"
            }
        },
        {
            from: {
                component: 0,
                output: "Output"
            },
            to: {
                component: 2,
                input: "A"
            }
        },
        {
            from: {
                component: 1,
                output: "Output"
            },
            to: {
                component: 3,
                input: "B"
            }
        },
        {
            from: {
                component: 2,
                output: "Output"
            },
            to: {
                component: 3,
                input: "A"
            }
        },
        {
            from: {
                component: 3,
                output: "Output"
            },
            to: {
                input: "Output"
            }
        },
    ],
}

export const BitAdderData: ComponentData = {
	components: [
		{
			id: 'XOR00000-0000-0000-0000-000000000000',
			name: "XOR",
			x: 0,
			y: 0
		},
		{
			id: nameToId["and"],
			name: "And",
			x: 0,
			y: 0
		},
	],
	componentInputs: ["A", "B"],
    componentOutputs: ["Sum", "Carry"],
    connections: [
        {
            from: {
                output: "A"
            },
            to: {
                component: 0,
                input: "A"
            }
        },
        {
            from: {
                output: "B"
            },
            to: {
                component: 0,
                input: "B"
            }
        },
        {
            from: {
                output: "A"
            },
            to: {
                component: 1,
                input: "A"
            }
        },
        {
            from: {
                output: "B"
            },
            to: {
                component: 1,
                input: "B"
            }
        },
		{
            from: {
				component: 0,
                output: "Output"
            },
            to: {
                input: "Sum"
            }
        },
		{
            from: {
				component: 1,
                output: "Output"
            },
            to: {
                input: "Carry"
            }
        },
    ],
};
