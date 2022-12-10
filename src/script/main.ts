import { Line } from './line.js';
import { Shape } from './shape.js';

// new Line({
//     start: { x: 100, y: 100 },
//     end: { x: 50, y: 200 },
//     color: 'red',
// });
// new Line({
//     start: { x: 50, y: 100 },
//     end: { x: 100, y: 200 },
// });

// new Line({
//     start: { x: 200, y: 150 },
//     end: { x: 150, y: 200 },
// });

// const a = createShape({ x: 400, y: 400 }, { color: 'blue', inputs: [], outputs: [] });
// const b = createShape({ x: 500, y: 400 }, { color: 'blue', inputs: [], outputs: [] });

const a = new Shape({ position: { x: 400, y: 400 }, color: 'lime', inputs: ["A", "B", "C", "D"], outputs: ["E", "F", "G"] });
const b = new Shape({ position: { x: 600, y: 350 }, color: 'lime', inputs: ["1"], outputs: [] });
const c = new Shape({ position: { x: 600, y: 500 }, color: 'lime', inputs: ["1"], outputs: [] });
// window.a = a;
// const b = new Shape({ position: { x: 500, y: 400 }, color: 'red', inputs: [], outputs: [] });