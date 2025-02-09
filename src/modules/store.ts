import spriteData from '../spritesheet.json'
import { addNewObject } from '../utils';
import {GameObject, Ship} from './ObjectClasses';

export interface Position {
    x: number;
    y: number;
}

export interface Vector {
    x: number;
    y: number;
}

export interface Frame {
    x0: number;
    y0: number;
    w: number;
    h: number;
}


interface Spritesheet {
    ship: Frame[];
    smallRock1: Frame;
    smallRock2: Frame;
    smallRock3: Frame;
    mediumRock1: Frame;
    mediumRock2: Frame;
    mediumRock3: Frame;
    bigRock1: Frame;
    bigRock2: Frame;
    bigRock3: Frame;
    ufo: Frame;
    bullet1: Frame;
    bullet2: Frame;
}

const spriteSheetData: Spritesheet = spriteData;

let img: HTMLImageElement = new Image()
img.src = '../../public/asteroids-2x.png'


let gameObjectsArr: GameObject[] = []
let ship: Ship; 

export function loadGameObjects(): Promise<void> {
    return new Promise((resolve, reject) => {
        img.onload = () => {
            ship = new Ship(img, spriteSheetData.ship, { x: 400, y: 400 }, 0) 
            addNewObject(gameObjectsArr, img, spriteSheetData.bigRock1, "Big")
            addNewObject(gameObjectsArr, img, spriteSheetData.bigRock2, "Big")
            addNewObject(gameObjectsArr, img, spriteSheetData.bigRock3, "Big")
            resolve(); 
        };
        img.onerror = (error) => {
            reject(error); 
        };
    });
}




export {spriteSheetData, gameObjectsArr, ship, img}

