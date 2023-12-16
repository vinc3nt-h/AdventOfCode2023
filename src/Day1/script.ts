import * as fs from 'fs';

const NUMBER_MAP = {
    "one": "1",
    "two":"2",
    "three":"3",
    "four":"4",
    "five":"5",
    "six":"6",
    "seven":"7",
    "eight":"8",
    "nine": "9",
}

const REGEX = new RegExp(/[0-9]|one|two|three|four|five|six|seven|eight|nine/g)

const sumCalibration = () => {
    const calibrationTxt = fs.readFileSync("calibration.txt", "utf-8")
    const calibrationArray = calibrationTxt.split(/\r?\n|\r|\n/g)
    let sumCalibration = 0
    for (const calibration of calibrationArray) {
        const matches = calibration.match(/[0-9]/g)
        let number = ""
        console.log(matches);
        
        if(matches.length < 2){
            number = matches[0] + matches[0]
        }
        else{
            number = matches[0] + matches[matches.length - 1]
        }
        console.log(number);
        
        sumCalibration += parseInt(number)
        

    }
}



const ensureIsDigit = (text: string) => {
    const number = parseInt(text)
    if(isNaN(number)){
        return NUMBER_MAP[text]
    }
    return number.toString()
}

const getCropMatch = (calibration: string, match: any) => {
    const cropCalibration = calibration.substring(match.index+1)
    const cropMatch = [...cropCalibration.matchAll(REGEX)]?.[0]
    console.log("cropCalibration");
    console.log(cropMatch);
    if(cropMatch && cropMatch.length > 0  && cropMatch[0] !== match[0]){
        console.log("crop");
        return getCropMatch(cropCalibration, cropMatch)
    }
    return match[0]
}

const sumCalibration2 = () => {
    const calibrationTxt = fs.readFileSync("calibration.txt", "utf-8")
    const calibrationArray = calibrationTxt.split(/\r?\n|\r|\n/g)
    let sumCalibration = 0
    const keys = Object.keys(NUMBER_MAP)    
    for (const calibration of calibrationArray) {
        const matches = [...calibration.matchAll(REGEX)]
        const isLetter = keys.includes(matches[matches.length -1][0])
        let number = ""
        if(isLetter){
            console.log(calibration);
            console.log("isLetter", matches[matches.length -1][0]);
            const lastNumber = getCropMatch(calibration,matches[matches.length -1])
            number = ensureIsDigit(matches[0][0]) + ensureIsDigit(lastNumber)
            console.log(matches[0][0], lastNumber);
            
        }
        else if(matches.length < 2){
            console.log("only one");
            
            console.log(matches[0][0], matches[0][0]);
            number = ensureIsDigit(matches[0][0]) + ensureIsDigit(matches[0][0])
        }
        else{
            console.log("normal");
            
            console.log(matches[0][0], matches[matches.length - 1][0]);
            
            number = ensureIsDigit(matches[0][0]) + ensureIsDigit(matches[matches.length - 1][0])
        }
        sumCalibration += parseInt(number)
        console.log(number);
        console.log("\n\n");
        

    }
    console.log(sumCalibration);
    
    
}

// sumCalibration()
sumCalibration2()