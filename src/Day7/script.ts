import { getFile, splitLine } from "../common/index.ts";

type Hand = {
  cards?: string;
  bid?: number;
  rank?: number
};

const CARD_ORDER = {"A":1, "K":2, "Q":3, "J":4, "T":5, "9":6, "8":7, "7":8, "6":9, "5":10, "4":11, "3":12, "2":13}

const CARD_ORDER2 = {"A":1, "K":2, "Q":3, "J":14, "T":5, "9":6, "8":7, "7":8, "6":9, "5":10, "4":11, "3":12, "2":13}


const buildLines = () => {
  const text = getFile("hands.txt");
  return splitLine(text);
};

const findMaxGroup = (groups: string[][]): number => {
    let maxLength = 0
    let maxIndex = 0
    for (let index = 0; index < groups.length; index++) {
        if(maxLength < groups[index].length){
            maxLength = groups[index].length
            maxIndex = index
        }else if(maxLength == groups[index].length){
            const currentHand = groups[index].reduce((acc, current) => acc+current, "")
            const maxHand = groups[maxIndex].reduce((acc, current) => acc+current, "")
            const isHigher = compareSimilarHand({cards: currentHand}, {cards:maxHand}, CARD_ORDER)
            if(isHigher){
                maxLength = groups[index].length
                maxIndex = index
            }
        }
    }
    return maxIndex
}

const rankHand = (line: string): number => {
  const cards = line.split("");
  let groupCards: string[][] = [];
  for (const card of cards) {
    const index = groupCards.findIndex((group) => group.includes(card));
    if (index != -1) {
      groupCards[index].push(card);
    } else {
      groupCards.push([card]);
    }
  }
  if(puzzle===2){
    const JGroupIndex = groupCards.findIndex((group) => group.includes("J"))
    if(JGroupIndex != -1 && groupCards.length>1){
        const newGroupCards = groupCards.filter((group) => !group.includes("J"))
        const maxGroupIndex = findMaxGroup(newGroupCards)
        newGroupCards[maxGroupIndex] = [...newGroupCards[maxGroupIndex], ...groupCards[JGroupIndex]]
        groupCards = newGroupCards
        
    }
  }
  switch (groupCards.length) {
    //nothing
    case 5:
      return 1;
      //1 pair
    case 4:
      return 2;
    case 3:
      //brelan
        if(groupCards.find((group) => group.length == 3)){
            return 4
        }
        //2 pairs
        return 3
    case 2:
      //carre
        if(groupCards.find((group) => group.length == 4)){
            return 6
        }
        //full
        return 5  
        //5 of a kind
    case 1:
      return 7;
  }
};

const buildHands = (lines: string[]): Hand[] => {
    const hands = [];
    for (const line of lines) {
      const text = line.split(" ");
      const rank = rankHand(text[0])
      hands.push({ cards: text[0], bid: parseInt(text[1]), rank });
    }
    return hands;
  };

const compareSimilarHand = (hand1: Hand, hand2: Hand, order?: any): boolean => {
  if(!order){
    if(puzzle == 1){
      order = CARD_ORDER
    }else{
      order = CARD_ORDER2
    }    
  }
    for (let i = 0; i < hand1.cards.length; i++) {
        if(order[hand1.cards[i]] < order[hand2.cards[i]]){
            return true
        }
        else if(order[hand1.cards[i]] > order[hand2.cards[i]]){
            return false
        }
    }
    return true
}


const compareHands = (hand1: Hand, hand2: Hand): boolean => {
    if(hand1.rank === hand2.rank){
        return compareSimilarHand(hand1, hand2)
    }
    else{
        return hand1.rank > hand2.rank
    }
};

const sortHands = (
  hands: Hand[],
  current: Hand,
  index: number,
  final: Hand[]
): Hand[] => {
    const isHigher = final[index] ? compareHands(current, final[index]) : true
    if(!isHigher || index >= final.length){
        final.splice(index, 0, current)
        return final 
    }
    else{
        return sortHands(hands, current, index+1, final)
    }
};

const getTotalWinning = (lines: string[]): number => {
    const hands = buildHands(lines)
    let sortedHands = []
    while(hands.length > 0){
        let current = hands.pop()
        const newSorted = sortHands(hands, current, 0, [...sortedHands])
        sortedHands = [...newSorted]
    }    
    return sortedHands.map((hand) => hand.bid).reduce((acc, current, index) => acc + (current * (index+1)), 0)

}

const lines = buildLines();

let puzzle = 1
console.log("Puzzle 1:", getTotalWinning(lines));
puzzle = 2
console.log("Puzzle 2:", getTotalWinning(lines));
