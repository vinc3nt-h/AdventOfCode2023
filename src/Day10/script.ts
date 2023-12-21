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
  "|": { y: [-1, 1], x: [0], xCross: 0, yCross: 1 },
  "-": { y: [0], x: [-1, 1], xCross: 1, yCross: 0, endX: true },
  L: { y: [-1], x: [1], xCross: 0.5, yCross: 0.5, endX: true },
  J: { y: [-1], x: [-1], xCross: -0.5, yCross: -0.5, endX: true },
  "7": { y: [1], x: [-1], xCross: 0.5, yCross: 0.5 },
  F: { y: [1], x: [1], xCross: -0.5, yCross: -0.5 },
  S: { y: [-1, 1], x: [-1, 1], xCross: 0, yCross: 0 },
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
    if (pipeKey && pipeKey != ".") {
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

let miss = 0;

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
  const path: Pipe[] = [];
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
    path.push(end);
  }
  return path;
};

const rayCastingVertical = (coordinates: Coord, path: Pipe[]) => {
  const pipeVerticalBefore = path
    .filter(
      (item) => item.coord.x === coordinates.x && item.coord.y < coordinates.y
    )
    .sort((a, b) => (a.coord.y < b.coord.y ? -1 : 1));
  const groupPipeNext: Pipe[][] = [];
  let groupIndex = 0;
  for (const pipe of pipeVerticalBefore) {
    if (groupPipeNext.length === 0) {
      groupPipeNext.push([pipe]);
    } else {
      const previous =
        groupPipeNext[groupIndex][groupPipeNext[groupIndex].length - 1];
      if (
        previous.coord.y === pipe.coord.y - 1 &&
        !PIPES_MAP[previous.key].endX
      ) {
        groupPipeNext[groupIndex].push(pipe);
      } else {
        groupIndex++;
        groupPipeNext.push([pipe]);
      }
    }
  }
  let nbPipeCrossed = 0;

  for (const pipes of groupPipeNext) {
    const valueGroup = pipes.reduce(
      (acc, current) => PIPES_MAP[current.key].xCross + acc,
      0
    );
    if (valueGroup == 1 || valueGroup == -1) {
      nbPipeCrossed++;
    }
  }
  // console.log(groupPipeNext, nbPipeCrossed, coordinates);

  return nbPipeCrossed % 2 == 1;
};

const rayCastingHorizontal = (coordinates: Coord, path: Pipe[]) => {
  const pipeHorizontalBefore = path
    .filter(
      (item) => item.coord.y === coordinates.y && item.coord.x < coordinates.x
    )
    .sort((a, b) => (a.coord.x < b.coord.x ? -1 : 1));
  const groupPipeNext: Pipe[][] = [];
  let groupIndex = 0;
  for (const pipe of pipeHorizontalBefore) {
    if (groupPipeNext.length === 0) {
      groupPipeNext.push([pipe]);
    } else {
      if (
        groupPipeNext[groupIndex][groupPipeNext[groupIndex].length - 1].coord
          .x ===
        pipe.coord.x - 1
      ) {
        groupPipeNext[groupIndex].push(pipe);
      } else {
        groupIndex++;
        groupPipeNext.push([pipe]);
      }
    }
  }
  let nbPipeCrossed = 0;

  for (const pipes of groupPipeNext) {
    const valueGroup = pipes.reduce(
      (acc, current) => PIPES_MAP[current.key].yCross + acc,
      0
    );
    if (valueGroup == 1 || valueGroup == -1) {
      nbPipeCrossed++;
    }
  }
  return nbPipeCrossed % 2 == 1;
};

const findTiles = (path: Pipe[], lines: string[]) => {
  const coordinatesPath = path.map((item) => item.coord);
  let tiles = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const coordinates = { x: j, y: i };
      if (
        !coordinatesPath.find(
          (item) => item.x == coordinates.x && item.y == coordinates.y
        )
      ) {
        const isInside = rayCastingVertical(coordinates, path);
        if (isInside) {
          tiles++;
        } else {
          miss++;
        }
      }
    }
  }
  return tiles;
};

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const puzzle1 = (lines: string[]) => {
  const start = findStart(lines);
  const path = findPath(lines, { key: "S", coord: start });

  return path.length / 2;
};

const puzzle2 = (lines: string[]) => {
  console.log(lines.length, lines[0].length);

  const start = findStart(lines);
  const path = findPath(lines, { key: "S", coord: start });
  const tiles = findTiles(path, lines);
  return tiles;
};

console.log("Puzzle 1:", puzzle1(buildLines()));
console.log("Puzzle 2:", puzzle2(buildLines()));
console.log(miss);
