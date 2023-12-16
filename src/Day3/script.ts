import { getFile, splitLine } from "../common/index.ts"

type Part = {
    value: string
    index: number
}

const REGEX_PART = new RegExp(/[0-9]+/g)
const REGEX_SPECIAL = new RegExp(/[^A-Za-z0-9\.]/g)
const REGEX_GEAR = new RegExp(/\*/g)


const buildLines = () => {
    const text = getFile("engine.txt")
    return splitLine(text)
}

const getAdjacent = (subLine: string, regex: RegExp) => {
    return [...subLine.matchAll(regex)]
}

const retrieveValidPart = (part:Part, lines: string[]): Part => {        
    for (const line of lines) {
        const subLine = line.substring(part.index - 1, part.index + part.value.length + 1)
        if(getAdjacent(subLine,REGEX_SPECIAL).length > 0){
            return part
        }
    }
    return null
}



const getEngineParts = (engineLines: string[]) => {
    const validParts: Part[] = []
    for (let i = 0; i < engineLines.length; i++) {
        const matches = [...engineLines[i].matchAll(REGEX_PART)]
        for (const match of matches) {
            const previousLine = i == 0 ? "": engineLines[i-1]
            const nextLine = i == engineLines.length -1 ? "": engineLines[i+1]
            const validPart = retrieveValidPart({value:match[0], index: match.index}, [previousLine, engineLines[i],nextLine])
            if(validPart){
                validParts.push(validPart)
            }
        }
    }
    return validParts
}

const retrieveValidGear = (gear:Part, lines: string[]): number => {
    const bornes = [gear.index-1, gear.index+gear.value.length]
    const potentialParts = getEngineParts(lines)
    const validParts:Part[] = []
    
    for (const part of potentialParts) {
        const bornesPart = [part.index,  part.index + part.value.length-1]
        const startTouch = bornesPart[0] >= bornes[0] && bornesPart[0] <= bornes[1]
        const endTouch = bornesPart[1] >= bornes[0] && bornesPart[1] <= bornes[1]
        if(startTouch || endTouch){
            validParts.push(part)
        }
    }
    if(validParts.length === 2){
        return parseInt(validParts[0].value) * parseInt(validParts[1].value)
    }else{
        return 0
    }
    
}


/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const getGearsRatio = (engineLines: string[]) => {
    let validGears: number[] = []
    for (let i = 0; i < engineLines.length; i++) {
        const matches = [...engineLines[i].matchAll(REGEX_GEAR)]
        for (const match of matches) {
            const previousLine = i == 0 ? "": engineLines[i-1]
            const nextLine = i == engineLines.length -1 ? "": engineLines[i+1]
            const validGear = retrieveValidGear({value:match[0], index: match.index}, [previousLine, engineLines[i],nextLine])
            validGears.push(validGear)
        }
    }
    return validGears
}

const sumEnginePart = (engineLines: string[]) => {
    const engineParts = getEngineParts(engineLines)    
    let sum = 0
    for (const part of engineParts) {
        sum+=parseInt(part.value)
    }
    return sum
}

const sumGearsRatio = (engineLines: string[]) => {
    const gears = getGearsRatio(engineLines)    
    return gears.reduce((prev, current) => prev + current)
}

const engineLines = buildLines()
console.log("puzzle 1:", sumEnginePart(engineLines))
console.log("puzzle 2:", sumGearsRatio(engineLines))