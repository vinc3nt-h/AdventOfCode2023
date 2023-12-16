import { getFile, splitLine } from "../common/index.ts"

type Map = {
    source: number
    destination: number
    range: number
}

type Almanac = {
    seeds: number[]
    seedToSoil: Map[]
    soilToFertilizer: Map[]
    fertilizerToWater: Map[]
    waterToLight: Map[]
    lightToTemperature: Map[]
    temperatureToHumidity: Map[]
    humidityToLocation: Map[]
}

type Target = {
    value: number
    location: number
}


const KEY_LIST = ["seedToSoil", "soilToFertilizer", "fertilizerToWater", "waterToLight", "lightToTemperature", "temperatureToHumidity", "humidityToLocation"]

const REGEX_NUMBER = new RegExp(/[0-9]+/g)

const buildLines = () => {
    const text = getFile("seeds.txt")
    return splitLine(text)
}

const constructAlmanac = (lines: string[]): Almanac => {
    let keyToSet = ""
    let almanac = {
        seeds: [],
        seedToSoil: [],
        soilToFertilizer: [],
        fertilizerToWater: [],
        waterToLight: [],
        lightToTemperature: [],
        temperatureToHumidity: [],
        humidityToLocation: [],
    }
    for (const line of lines) {        
        if(line.match(/seeds/g)){
            const numbers = line.match(REGEX_NUMBER)
            almanac["seeds"] = numbers.map((num) => parseInt(num))
        }
        else if(keyToSet !== ''){
            const numbers = line.match(REGEX_NUMBER)            
            if(!numbers){
                keyToSet = ""
            }else{
                const map: Map = {destination: parseInt(numbers[0]), source: parseInt(numbers[1]), range: parseInt(numbers[2])}
                almanac[keyToSet].push(map)
            }
        }else{
            if(line.match(/seed-to-soil/g)){
                keyToSet = "seedToSoil"
                almanac["seedToSoil"] = []
            }
            if(line.match(/soil-to-fertilizer/g)){
                keyToSet = "soilToFertilizer"
                almanac["soilToFertilizer"] = []
            }
            if(line.match(/fertilizer-to-water/g)){
                keyToSet = "fertilizerToWater"
                almanac["fertilizerToWater"] = []
            }
            if(line.match(/water-to-light/g)){
                keyToSet = "waterToLight"
                almanac["waterToLight"] = []
            }
            if(line.match(/light-to-temperature/g)){
                keyToSet = "lightToTemperature"
                almanac["lightToTemperature"] = []
            }
            if(line.match(/temperature-to-humidity/g)){
                keyToSet = "temperatureToHumidity"
                almanac["temperatureToHumidity"] = []
            }
            if(line.match(/humidity-to-location/g)){
                keyToSet = "humidityToLocation"
                almanac["humidityToLocation"] = []
            }
        }
    }
    return almanac
}

const getMapDestination = (start: number, map: Map): number => {
    if(start >= map.source && start < map.source + map.range){
        return map.destination + (start - map.source)
    }
    return start
}

const getLocation = (seed: number, almanac: Almanac): number => {
    let destination = seed
    for (const key of KEY_LIST) {
        const maps = almanac[key] as Map[]
        for (const map of maps) {
            const possibleDestination = getMapDestination(destination, map)            
            if(possibleDestination != destination){
                destination = possibleDestination
                break
            }
        }
    }
    return destination
}

const runOverSeeds = (seed: number, range: number, target: Target ,almanac: Almanac): Target => {    
    if(range==0){
        return target
    }
    const location = getLocation(seed, almanac)
    if(!target.location || location < target.location ){
        return runOverSeeds(seed-1, range-1, {value: seed, location}, almanac)
    }
    return runOverSeeds(seed-1, range-1, target, almanac)
}

const loopOverSeeds = (seed: number, range: number ,almanac: Almanac): Target => {  
    const target = {value: null, location: null}
    for (let index = 0; index < range; index++) {
        const  newSeed = seed+index
        const location = getLocation(newSeed, almanac)
        if(!target.location || location < target.location ){
            target.location = location
            target.value = newSeed
        }
    }  
    return target
}

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const getMinimunLocation = (lines: string[]) => {
    const almanac = constructAlmanac(lines)
    let location = null
    for (const seed of almanac.seeds) {
        const newLocation = getLocation(seed, almanac)
        if(location !== null){
            if(newLocation < location){
                location = newLocation
            }
        }else{
            location = newLocation
        }
    }
    return location
}

const getSeedWithMinimumLocation = (lines: string[]) => {
    const target = {value: null, location: null}
    const almanac = constructAlmanac(lines)
    for (let i = 0; i < almanac.seeds.length; i=i+2) {
        // const {location, value} = runOverSeeds(almanac.seeds[i]+almanac.seeds[i+1]-1, almanac.seeds[i+1]-1, target, almanac)        
        const {location, value} = loopOverSeeds(almanac.seeds[i], almanac.seeds[i+1], almanac)
        if(!target.location || location < target.location){
            target.location = location
            target.value = value
        }
    }
    return target.location
}

const lines = buildLines()
console.log("Puzzle 1:", getMinimunLocation(lines));
console.log("Puzzle 2:", getSeedWithMinimumLocation(lines));

