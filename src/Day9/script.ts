import { getFile, splitLine } from "../common/index.ts";

const buildLines = () => {
  const text = getFile("report.txt");
  return splitLine(text);
};

const buildHistory = (line: string): number[] => {
  return line.split(" ").map((item) => parseInt(item));
};

const predictNext = (history: number[]): number => {
  const newHistory = [];
  for (let i = 0; i < history.length - 1; i++) {
    newHistory.push(history[i + 1] - history[i]);
  }
  if (newHistory.every((item) => item == 0)) {
    return history[history.length - 1];
  } else {
    const increase = predictNext(newHistory);
    return history[history.length - 1] + increase;
  }
};

const predictPrevious = (history: number[]): number => {
  const newHistory = [];
  for (let i = 0; i < history.length - 1; i++) {
    newHistory.push(history[i + 1] - history[i]);
  }
  if (newHistory.every((item) => item == 0)) {
    return history[0];
  } else {
    const increase = predictPrevious(newHistory);
    return history[0] - increase;
  }
};

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const puzzle1 = (lines: string[]) => {
  const report = lines.map((line) => buildHistory(line));
  const allNext: number[] = [];
  for (const history of report) {
    const prediction = predictNext(history);
    allNext.push(prediction);
  }
  return allNext.reduce((acc, current) => acc + current);
};

const puzzle2 = (lines: string[]) => {
  const report = lines.map((line) => buildHistory(line));
  const allNext: number[] = [];
  for (const history of report) {
    const prediction = predictPrevious(history);
    allNext.push(prediction);
  }
  return allNext.reduce((acc, current) => acc + current);
};

console.log("Puzzle 1:", puzzle1(buildLines()));
console.log("Puzzle 2:", puzzle2(buildLines()));
