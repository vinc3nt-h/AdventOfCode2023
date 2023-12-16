
const findUntilZ = async (
    map,
    startNode,
    startStep,
    startIndex
  ) => {
    let endNode = startNode;
    let indexInstruction = startIndex;
    let step = startStep;
    let firstLoop = true;
    while (!endNode.match(/[A-Z0-9][A-Z0-9]Z/g) && step < 100) {
      firstLoop = false;
      if (indexInstruction >= map.instruction.length) {
        indexInstruction = 0;
      }
      const instruction = map.instruction[indexInstruction];
      endNode = map.nodes[endNode][instruction];
      indexInstruction++;
      console.log(step);
  
      step++;
    }
    return Promise.resolve({
      step,
      indexInstruction: indexInstruction,
      node: endNode,
    });
  };

  
onmessage = async (event) => {
    const { map, result } = event.data;
    const newResult = await findUntilZ(map, result.node, result.step, result.indexInstruction);
    postMessage(newResult);
  };