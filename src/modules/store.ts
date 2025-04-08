import spriteData from '../spritesheet.json'
import { mapHeight, mapWidth } from '../main';
import { addNewObject } from '../utils';
import { GameObject } from './ObjectClasses';
import { Ship } from './Ship';

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
            ship = new Ship(img, spriteSheetData.ship, { x: mapWidth/2, y: mapHeight/2 }, 0)
            asteroidsGenerator()
            resolve();
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

export function restartGame(){
    gameObjectsArr = []
    ship = new Ship(img, spriteSheetData.ship, { x: mapWidth/2, y: mapHeight/2 }, 0)
    asteroidsGenerator()
    document.getElementById("score")!.innerHTML = ship.score.toString()
    document.getElementById("livesLeft")!.innerHTML = ship.lives.toString()
}


export function asteroidsGenerator(){
    for(let i = 0; i<2; i++){
        spriteSheetData.bigRock.forEach((frame) => {
            addNewObject(gameObjectsArr, img, frame, "Big")
        })
    }
}



export { spriteSheetData, gameObjectsArr, ship, img }

