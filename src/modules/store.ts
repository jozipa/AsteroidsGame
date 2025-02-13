import spriteData from '../spritesheet.json'
import { addNewObject } from '../utils';
import { GameObject, Ship } from './ObjectClasses';

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
    smallRock: Frame[]
    mediumRock: Frame[];
    bigRock: Frame[];
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
            spriteSheetData.bigRock.forEach((frame) => {
                addNewObject(gameObjectsArr, img, frame, "Big")
            })
            resolve();
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}




export { spriteSheetData, gameObjectsArr, ship, img }

