import * as fs from 'fs';

type Colors = "red" | "green" | "blue"

type Set = {
    [key in Colors]?: number
}

type Game = Array<Set>


const INPUT1 = {"red": 12, "green": 13, "blue": 14}
const INPUT1_KEYS = Object.keys(INPUT1)

const buildGames = (file: string): Record<number,Game> => {
    const gamesTxt = fs.readFileSync(file, "utf-8")
    const gamesLines = gamesTxt.split(/\r?\n|\r|\n/g)
    const games = {}
    for (const line of gamesLines) {
        const id = /[0-9]*:/.exec(line)
        
        const game = line.substring(id.index + id[0].length).split(";").map(sets => {
            const dirtySet = sets.split(",")
            const set = dirtySet.map((color) => {
                const name = color.match(/[a-z]+/g)[0]
                const number = color.match(/[0-9]+/g)[0]
                return {[name]: parseInt(number)}
            }).reduce((prev, current) => {
                return {...prev, ...current}
            })
            return set
        })
        games[parseInt(id[0].substring(0, id[0].length-1))] = game
    }
    return games
}

const checkGame = (game: Game) => {
    let isPossible = true
    
    for (const set of game) {        
        for (const key of INPUT1_KEYS) {
            if(INPUT1[key] < set[key]){
                isPossible = false
            }
        }
        if(!isPossible){
            break
        }
    }    
    return isPossible
}

const getMinimumSet = (game: Game): Set => {
    const miniSet = {}
    for (const set of game) {
        for (const key of Object.keys(set)) {
            if(set[key] > (miniSet?.[key] ? miniSet?.[key] : 0)){
                miniSet[key] = set[key]
            }
        }
    }
    return miniSet
}


const possibleGames = () => {
    const games = buildGames("games.txt")
    const possibleIds = []
    for (const id in games) {
        const isPossible = checkGame(games[id])
        if(isPossible){
            possibleIds.push(id)
        }
    }
    const result = possibleIds.reduce((prev, current) => parseInt(prev)+parseInt(current))
    return result  
}

const possibleGames2 = () => {
    const games = buildGames("games.txt")
    let sumAllSet = 0
    for (const game of Object.values(games)) {
        const miniSet = getMinimumSet(game)
        const sumMiniSet = Object.values(miniSet).reduce((prev, current) => prev * current, 1)
        
        sumAllSet += sumMiniSet
    }
    return sumAllSet
    
}

console.log("result 1 : ", possibleGames())
console.log("result 2 : ", possibleGames2());
