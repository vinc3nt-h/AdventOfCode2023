import { getFile, splitLine } from "../common/index.ts";

type Coord = {
  x: number;
  y: number;
};

const buildLines = () => {
  const text = getFile("galaxies.txt");
  return splitLine(text);
};

const findEmpty = (lines: string[]) => {
  const emptyLines = lines.reduce((acc, current, index) => {
    if (!current.match(/#/g)) {
      acc.push(index);
    }
    return acc;
  }, []);
  for (const line of lines) {
    if (!line.match(/#/g)) {
    }
  }

  const emptyColumns = [];
  for (let i = 0; i < lines[0].length; i++) {
    let isEmpty = true;
    for (let j = 0; j < lines.length; j++) {
      if (lines[j][i] == "#") {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) {
      emptyColumns.push(i);
    }
  }
  return { emptyLines, emptyColumns };
};

const expandUniverse = (
  lines: string[],
  emptyLines: number[],
  emptyColumns: number[]
): string[] => {
  let universe = [...lines];
  const lineToInsert = universe[emptyLines[0]];
  for (let i = 0; i < emptyLines.length; i++) {
    universe.splice(emptyLines[i] + i, 0, lineToInsert);
  }
  for (let i = 0; i < universe.length; i++) {
    const lineSplit = universe[i].split("");
    for (let j = 0; j < emptyColumns.length; j++) {
      lineSplit.splice(emptyColumns[j] + j, 0, ".");
    }
    universe[i] = lineSplit.reduce((acc, current) => acc + current, "");
  }

  return universe;
};

const findGalaxies = (universe: string[]): Coord[] => {
  const galaxiesFound = [];
  for (let i = 0; i < universe.length; i++) {
    const galaxies = [...universe[i].matchAll(/#/g)];
    if (galaxies.length > 0) {
      galaxiesFound.push(
        ...galaxies.map((galaxy) => ({ x: galaxy.index, y: i }))
      );
    }
  }

  return galaxiesFound;
};

const findGalaxiesExpanded = (
  universe: string[],
  emptyColumns: number[],
  emptyLines: number[],
  expansion: number
): Coord[] => {
  const galaxiesFound = [];
  for (let i = 0; i < universe.length; i++) {
    const galaxies = [...universe[i].matchAll(/#/g)];
    if (galaxies.length > 0) {
      for (const galaxy of galaxies) {
        const prevXExpansion = emptyColumns.filter(
          (column) => column < galaxy.index
        );
        const x = galaxy.index + prevXExpansion.length * (expansion - 1);
        const prevYExpansion = emptyLines.filter((line) => line < i);
        const y = i + prevYExpansion.length * (expansion - 1);
        galaxiesFound.push({ x, y });
      }
    }
  }
  return galaxiesFound;
};

const findShortestPaths = (galaxies: Coord[], start: Coord) => {
  if (galaxies.length == 0) {
    return [0];
  }
  const pathsLength = [];
  for (const galaxy of galaxies) {
    const xLength = Math.abs(start.x - galaxy.x);
    const yLength = Math.abs(start.y - galaxy.y);
    pathsLength.push(xLength + yLength);
  }
  const newStart = galaxies.shift();
  return pathsLength.concat(findShortestPaths(galaxies, newStart));
};

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const puzzle1 = (lines: string[]) => {
  const { emptyLines, emptyColumns } = findEmpty(lines);
  const universe = expandUniverse(lines, emptyLines, emptyColumns);
  const galaxies = findGalaxies(universe);
  const start = galaxies.shift();
  const pathsLength = findShortestPaths(galaxies, start);
  return pathsLength.reduce((acc, current) => acc + current, 0);
};

const puzzle2 = (lines: string[]) => {
  const { emptyLines, emptyColumns } = findEmpty(lines);
  const galaxies = findGalaxiesExpanded(
    lines,
    emptyColumns,
    emptyLines,
    1000000
  );
  const start = galaxies.shift();
  const pathsLength = findShortestPaths(galaxies, start);
  return pathsLength.reduce((acc, current) => acc + current, 0);
};

console.log("Puzzle 1:", puzzle1(buildLines()));
console.log("Puzzle 2:", puzzle2(buildLines()));
