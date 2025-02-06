import spriteData from '../spritesheet.json'
import {GameObject, Ship} from './ObjectClasses';

export interface Position {
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


const data: Spritesheet = spriteData;

const spriteArray = Object.entries(data).map(([key, value]) => {
    return { key: key, frame: value };
});


let img = new Image()
img.src = '../../public/asteroids-2x.png'

type GameObjectWrapper = {
    key: string;
    utilities: GameObject; 
}

let gameObjectsArr: GameObjectWrapper[] = []
let ship: Ship; 

export function loadGameObjects(): Promise<void> {
    return new Promise((resolve, reject) => {
        img.onload = () => {
            spriteArray.forEach(element => {
                if (element.key == 'ship') {
                    ship = new Ship(img, element.frame, { x: 0, y: 0 }, 0) 
                } else {
                    gameObjectsArr.push({ key: element.key, utilities: new GameObject(img, element.frame, { x: 400, y: 400 }) });
                }
            });
            resolve(); 
        };

        img.onerror = (error) => {
            reject(error); 
        };
    });
}




export {data, gameObjectsArr, ship}

