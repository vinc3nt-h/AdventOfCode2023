import { getFile, splitLine } from "../common/index.ts"

type Card = {
    winning: number[]
    own: number[]
}

const buildLines = () => {
    const text = getFile("cards.txt")
    return splitLine(text)
}

const buildNumbers = (numbers: string): number[] => {
    return numbers.split(" ").map((text) => parseInt(text)).filter((number) => !isNaN(number))
}

const buildCard = (lines: string): Card => {
    const numbers = lines.split(":")[1].split("|")
    const winning = buildNumbers(numbers[0])
    const own = buildNumbers(numbers[1])
    return {winning, own}
}

const getWinnings = (card: Card):number[] => {
    let winnings = []
    for (const winning of card.winning) {
        if(card.own.includes(winning)){
            winnings.push(winning)
        }
    }
    return winnings
}


const setDuplicateCards = (card: Card, index: number, pile: Card[], duplicatePile: Card[][]): {pile: Card[], duplicatePile: Card[][]} => {
    const winnings = getWinnings(card)
    const numberOfDuplicate = duplicatePile[index]?.length ?? 0
    
    for (let nb = 0; nb < numberOfDuplicate+1; nb++) {
        for (let i = 0; i < winnings.length; i++) {
            if(pile[index+i+1]){
                if(duplicatePile[index+i+1]){
                    duplicatePile[index+i+1].push(pile[index+i+1])
                }else{
                    duplicatePile[index+i+1] = [pile[index+i+1]]
                }
            }
        }
        
    }
    if(index >= pile.length -1){
        return {pile, duplicatePile}
    }
    return setDuplicateCards(pile[index+1], index+1, pile, duplicatePile)
}


/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

const getTotalPoints = (lines: string[]): number => {
    const cards = lines.map((line, index) => buildCard(line))
    const scores = cards.map(card => getWinnings(card).reduce((acc, current) => acc === 0 ? 1 : acc*2, 0))
    const total = scores.reduce((acc, current) => acc + current)
    return total
}

const getTotalCards = (lines: string[]): number => {
    const cards = lines.map((line) => buildCard(line))
    const {pile, duplicatePile} = setDuplicateCards(cards[0], 0, cards, [])
    return pile.length + (duplicatePile.map((pile) => pile.length).reduce((acc, current) => acc + current))
}

const lines = buildLines()
console.log("Puzzle 1: ", getTotalPoints(lines));
console.log("Puzzle 1: ", getTotalCards(lines));

