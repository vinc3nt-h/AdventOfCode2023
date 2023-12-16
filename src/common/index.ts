import * as fs from 'fs';

export const getFile = (file: string): string => {
    return fs.readFileSync(file, "utf-8")
}

export const splitLine = (text: string): string[] => {
    return text.split(/\r?\n|\r|\n/g)

}