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

const gcd = (a: number, b: number): number => {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
} 

const lcm = (a: number, b: number): number => {
  return (a*b)/gcd(a,b)
}

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

// const findAllPathToZZZLoop = (map: Map):number => {
//     let endNodes = Object.keys(map.nodes).filter((key) => key.match(/[A-Z0-9][A-Z0-9]A/g))
//     let indexInstruction = 0
//     let steps = 0
//     const start = Date.now()

//     while(steps < 5000000000 && !endNodes.every((key) => key.match(/[A-Z0-9][A-Z0-9]Z/g))){
//         if(indexInstruction >= map.instruction.length){
//             indexInstruction = 0
//         }
//         const newEndNodes = []
//         const instruction = map.instruction[indexInstruction]
//         for (let i = 0; i < endNodes.length; i++) {

//             newEndNodes.push(map.nodes[endNodes[i]][instruction])
//         }
//         endNodes = newEndNodes
//         indexInstruction++
//         steps++
//     }
//     const end = Date.now()
//     console.log( end - start);
//     console.log(endNodes)
//     return steps
// }

const findAllPathToZZZOptimize = async (map: Map) => {
  let startNodes = Object.keys(map.nodes).filter((key) =>
    key.match(/[A-Z0-9][A-Z0-9]A/g)
  );

  let starts: Result[] = startNodes.map((startNode) => {
    return { step: 0, indexInstruction: 0, node: startNode };
  });

  const results = await Promise.all(
    starts.map((start) =>
      findUntilZ(map, start.node, start.step, start.indexInstruction)
    )
  );

  let leastCommon = 0
  for (let i = 1; i < results.length; i++) {
    if(leastCommon != 0){
      leastCommon = lcm(leastCommon, results[i].step)
    }else{
      leastCommon = lcm(results[i-1].step, results[i].step)
    }
  }



  console.log(leastCommon);
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
  findAllPathToZZZOptimize(map);
};

console.log("Puzzle 1:", puzzle1(buildLines()));
console.log("Puzzle 2:", puzzle2(buildLines()));