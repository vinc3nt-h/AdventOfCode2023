import { getFile, splitLine } from "../common/index.ts";

const buildLines = () => {
  const text = getFile("pipes.txt");
  return splitLine(text);
};

type Coord = {
  x: number;
  y: number;
};

type Pipe = {
  coord: Coord;
  key: string;
};

const PIPES_MAP = {
  "|": { y: [-1, 1], x: [0] },
  "-": { y: [0], x: [-1, 1] },
  L: { y: [-1], x: [1] },
  J: { y: [-1], x: [-1] },
  "7": { y: [1], x: [-1] },
  F: { y: [1], x: [1] },
  S: { y: [-1, 1], x: [-1, 1] },
};

const findStart = (map: string[]): Coord => {
  for (let i = 0; i < map.length; i++) {
    const itemFound = map[i].match("S");
    if (itemFound) {
      return { x: itemFound.index, y: i };
    }
  }
};

const findNextAfterStart = (
  entry: Coord,
  coords: Coord[],
  map: string[]
): Coord => {
  for (const coord of coords) {
    const pipeKey = map[coord.y][coord.x];
    if (pipeKey) {
      const nextCoords = findNextCoords(
        entry,
        { key: pipeKey, coord: { x: coord.x, y: coord.y } },
        true
      );
      const matchStart = nextCoords.find(
        (coord) => coord.x === entry.x && coord.y === entry.y
      );
      if (matchStart) {
        return coord;
      }
    }
  }
};

const findNextCoords = (
  entry: Coord,
  current: Pipe,
  keepEntry: boolean = false
): Coord[] => {
  const pipeMap = PIPES_MAP[current.key];
  const nextCoord: Coord[] = [];
  nextCoord.push(
    ...pipeMap.x.map((x) => ({
      x: current.coord.x + x,
      y: current.coord.y,
    }))
  );
  nextCoord.push(
    ...pipeMap.y.map((y) => ({
      y: current.coord.y + y,
      x: current.coord.x,
    }))
  );
  if (entry == null || keepEntry) {
    return nextCoord;
  }
  return nextCoord.filter(
    (coord) =>
      (coord.x != entry.x || coord.y != entry.y) &&
      (coord.x != current.coord.x || coord.y != current.coord.y)
  );
};

const findPath = (map: string[], start: Pipe) => {
  let end: Pipe = start;
  let previousCoord: Coord;
  const path: string[] = [];
  while (
    end?.coord?.x !== start.coord.x ||
    end?.coord?.y !== start.coord.y ||
    previousCoord == null
  ) {
    const nextCoords = findNextCoords(previousCoord, end);
    previousCoord = end.coord;
    let key: string;
    if (nextCoords.length > 1) {
      const coordAfterStart = findNextAfterStart(start.coord, nextCoords, map);
      key = map[coordAfterStart.y][coordAfterStart.x];
      end = { coord: coordAfterStart, key };
    } else {
      key = map[nextCoords[0].y][nextCoords[0].x];
      end = { coord: nextCoords[0], key };
    }
    path.push(key);
  }
  return path;
};

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const puzzle1 = (lines: string[]) => {
  const start = findStart(lines);
  const path = findPath(lines, { key: "S", coord: start });

  return path.length / 2;
};

const puzzle2 = (lines: string[]) => {};

console.log("Puzzle 1:", puzzle1(buildLines()));
console.log("Puzzle 2:", puzzle2(buildLines()));
