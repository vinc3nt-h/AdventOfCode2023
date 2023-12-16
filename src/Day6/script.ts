import { getFile, splitLine } from "../common/index.ts"

type Race = {
    time: number
    record: number
}

const buildLines = () => {
    const text = getFile("records.txt")
    return splitLine(text)
}

const isWinning = (time, race: Race) => {
    const vitesse = time;
    const distance = (race.time-time) * vitesse    
    if(distance > race.record){
        return true
    }
    return false
}

const getWinningTimes = (race: Race): number[] => {
    const records = []    
    for (let i = 0; i < race.time; i++) {
        const isRecord = isWinning(i,race)
        if(isRecord){
            records.push(i)
        }
    }
    return records
}

const buildRaces = (lines: string[]): Race[] => {
    const times = lines[0].match(/[0-9]+/g).map((time) => parseInt(time))
    const distances = lines[1].match(/[0-9]+/g).map((distance) => parseInt(distance))
    const records = []
    for (let index = 0; index < times.length; index++) {
        records.push({time: times[index], record: distances[index]})
    }
    return records
}

const buildRace2 = (lines: string[]): Race => {
    const time = lines[0].match(/[0-9]+/g).reduce((acc, current) => acc+current, "")
    const distance = lines[1].match(/[0-9]+/g).reduce((acc, current) => acc+current, "")
    return {time: parseInt(time), record: parseInt(distance)}
}

const getAllRecords = (lines: string[]) => {
    const races = buildRaces(lines)
    const records = []
    for (const race of races) {
        const raceRecords = getWinningTimes(race)
        records.push(raceRecords.length)
    }
    return records.reduce((acc, current) => acc * current, 1)
}

const getAllRecords2 = (lines: string[]) => {
    const race = buildRace2(lines)
    const raceRecords = getWinningTimes(race)
    return raceRecords.length
}
const lines = buildLines()
console.log("Puzzle 1:", getAllRecords(lines));
console.log("Puzzle 2:", getAllRecords2(lines));