// The prize wheel's geometry. SVGWheel draws each slice as wide as its
// probability (a 30% prize gets 108°), clockwise from the top, where the
// pointer is. The spin used to aim as if every slice were the same width
// (60° each), and added each spin on top of the last without accounting
// for where the wheel already was — so most spins stopped on a different
// prize from the one the student was given.

export interface WheelPrize {
  prob: number;
}

const mod360 = (deg: number) => ((deg % 360) + 360) % 360;

// Where each slice starts and ends, in degrees clockwise from the top.
export function sliceBounds(prizes: WheelPrize[]) {
  let at = 0;
  return prizes.map((p) => {
    const start = at;
    at += (p.prob / 100) * 360;
    return { start, end: at };
  });
}

// Draws a prize by its probability. `rand` in [0, 1).
export function pickPrize(prizes: WheelPrize[], rand: number): number {
  const target = rand * 100;
  let accumulated = 0;
  for (let i = 0; i < prizes.length; i++) {
    accumulated += prizes[i].prob;
    if (target < accumulated) return i;
  }
  return prizes.length - 1;
}

// The rotation that leaves prize `index` under the pointer after a few full
// turns, from wherever the wheel is now. It stops somewhere inside the
// slice, not always dead centre and never on an edge.
export function spinTo(currentRotation: number, prizes: WheelPrize[], index: number, rand: number, turns = 5): number {
  const { start, end } = sliceBounds(prizes)[index];
  const landing = start + (end - start) * (0.15 + 0.7 * rand);
  const orientation = mod360(360 - landing);
  return currentRotation + turns * 360 + mod360(orientation - mod360(currentRotation));
}

// Which prize the pointer shows at a given rotation.
export function prizeUnderPointer(prizes: WheelPrize[], rotation: number): number {
  const angle = mod360(-rotation);
  const bounds = sliceBounds(prizes);
  const found = bounds.findIndex((b) => angle >= b.start && angle < b.end);
  return found === -1 ? prizes.length - 1 : found;
}
