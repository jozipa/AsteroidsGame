import { ship, Frame } from "./modules/store";
import { GameObject } from "./modules/ObjectClasses";

export function addNewObject(gameArr: Object[], img: HTMLImageElement, sprite: Frame, type: string): void{
    const randomAngleRadians = Math.random() * Math.PI * 2;
    let velocity = Math.floor(Math.random() * 5) + 1
    let positionX = 0
    let positionY = 0
    if(Math.floor(Math.random() * 2)){ // 50% szans
        positionX = Math.floor(Math.random() * 801)
        positionY =  Math.floor(Math.random() * 2) * 800
    } else {
        positionY = Math.floor(Math.random() * 801)
        positionX =  Math.floor(Math.random() * 2) * 800
    }
    gameArr.push(new GameObject(img, sprite, {x: positionX, y: positionY},{x: Math.cos(randomAngleRadians), y: Math.sin(randomAngleRadians)}, velocity, type))
}

export function keysEvent() {
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                ship.skin = 1;
                break;
            case "ArrowLeft":
                ship.rotationDirection = -1;
                break;
            case "ArrowRight":
                ship.rotationDirection = 1;
                break;
            case " ": // Spacja
                ship.shoot();
                break;
        }
    });
    window.addEventListener("keyup", (event) => {
        switch (event.key) {
            case "ArrowUp":
                ship.skin = 0;
                break;
            case "ArrowLeft":
                if (ship.rotationDirection == -1) {
                    ship.rotationDirection = 0;
                }
                break;
            case "ArrowRight":
                if (ship.rotationDirection == 1) {
                    ship.rotationDirection = 0;
                }
                break;
        }
    });
}

