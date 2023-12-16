import { getFile, splitLine } from "../common/index.ts";

type Instruction = string[];

type Node = {
  L: string;
  R: string;
};

type Map = {
  instruction: Instruction;
  nodes: Record<string, Node>;
};

type Result = {
  step: number;
  indexInstruction: number;
  node: string;
};

const buildLines = () => {
  const text = getFile("map.txt");
  return splitLine(text);
};

const constructIntruction = (line: string): Instruction => {
  return line.split("");
};

const constructNodes = (lines: string[]): Record<string, Node> => {
  const nodes = {};
  for (const line of lines) {
    if (line != "") {
      const index = line.split("=")[0].trim();
      const paths = line.split("=")[1].match(/[A-Z0-9]+/g);
      nodes[index] = { L: paths[0], R: paths[1] };
    }
  }
  return nodes;
};

const buildMap = (lines: string[]): Map => {
  const map = { instruction: [], nodes: {} };
  const lineInstruction = lines.shift();
  map.instruction = constructIntruction(lineInstruction);
  map.nodes = constructNodes(lines);
  return map;
};

const findUntilZ = async (
  map: Map,
  startNode: string,
  startStep: number,
  startIndex: number
): Promise<Result> => {
  let endNode = startNode+"";
  let indexInstruction = startIndex+0;
  let step = startStep+0;
  let firstLoop = true;
  while (!endNode.match(/[A-Z0-9][A-Z0-9]Z/g) || firstLoop) {
      
    if (indexInstruction >= map.instruction.length) {
        
        indexInstruction = 0;
    }
    const instruction = map.instruction[indexInstruction];
    endNode = map.nodes[endNode][instruction];
    
    indexInstruction++;
    step++;
    firstLoop = false;
  }
  return Promise.resolve({
    step,
    indexInstruction: indexInstruction,
    node: endNode,
  });
};

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const findPathToZZZ = (map: Map): number => {
  let endNode = "AAA";
  let indexInstruction = 0;
  let steps = 0;
  while (endNode != "ZZZ") {
    if (indexInstruction >= map.instruction.length) {
      indexInstruction = 0;
    }
    const instruction = map.instruction[indexInstruction];
    endNode = map.nodes[endNode][instruction];
    indexInstruction++;
    steps++;
  }
  return steps;
};

const findAllPathToZZZLoop = (map: Map):number => {
    let endNodes = Object.keys(map.nodes).filter((key) => key.match(/[A-Z0-9][A-Z0-9]A/g))
    let indexInstruction = 0
    let steps = 0
    const start = Date.now()

    while(steps < 5000000000 && !endNodes.every((key) => key.match(/[A-Z0-9][A-Z0-9]Z/g))){
        if(indexInstruction >= map.instruction.length){
            indexInstruction = 0
        }
        const newEndNodes = []
        const instruction = map.instruction[indexInstruction]
        for (let i = 0; i < endNodes.length; i++) {

            newEndNodes.push(map.nodes[endNodes[i]][instruction])
        }
        endNodes = newEndNodes
        indexInstruction++
        steps++
    }
    const end = Date.now()
    console.log( end - start);
    console.log(endNodes)
    return steps
}

const findAllPathToZZZOptimize = async (map: Map) => {
  let endNodes = Object.keys(map.nodes).filter((key) =>
    key.match(/[A-Z0-9][A-Z0-9]A/g)
  );
  let steps = 0;
  const start = Date.now();
  let allSame = false;
  let results: Result[] = endNodes.map((endNode) => {
    return { step: 0, indexInstruction: 0, node: endNode };
  });
  console.log("start", results);

  let loop = 0;
  while (!allSame && loop < 100) {
    const newResults = await Promise.all(
      results.map((result) =>
        findUntilZ(map, result.node, result.step, result.indexInstruction)
      )
    );
    console.log("newResults", newResults);
    
    allSame = newResults
      .map((result) => result.step)
      .every((step) => step === results[0].step);
    results = newResults
    loop++;
  }

  console.log("FINAL", results);

  const end = Date.now();
  console.log("TIME", end - start);
  return steps;
};

/* -------------------------------------------------------------------------- */
/*                                     RUN                                    */
/* -------------------------------------------------------------------------- */

const puzzle1 = (lines: string[]): number => {
  const map = buildMap(lines);
  return findPathToZZZ(map);
};

const puzzle2 = (lines: string[]) => {
  const map = buildMap(lines);
  console.log(findAllPathToZZZLoop(map));
};

// console.log("Puzzle 1:", puzzle1(buildLines()));
puzzle2(buildLines());
