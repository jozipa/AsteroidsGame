import { ship, Frame, Position } from "./modules/store";
import { GameObject } from "./modules/ObjectClasses";

export function addNewObject(gameArr: Object[], img: HTMLImageElement, sprite: Frame, type: string): void {
    const randomAngleRadians = Math.random() * Math.PI * 2;
    let velocity = (Math.random() * 3) + 0.1
    let positionX = 0
    let positionY = 0
    if (Math.floor(Math.random() * 2)) { // 50% szans
        positionX = Math.floor(Math.random() * 801)
        positionY = Math.floor(Math.random() * 2) * 800
    } else {
        positionY = Math.floor(Math.random() * 801)
        positionX = Math.floor(Math.random() * 2) * 800
    }
    gameArr.push(new GameObject(img, sprite, { x: positionX, y: positionY }, { x: Math.cos(randomAngleRadians), y: Math.sin(randomAngleRadians) }, velocity, type))
}


export function addChildrenObject(gameArr: Object[], img: HTMLImageElement, sprite: Frame[], position: Position, type: string): void {
    for (let i = 0; i < 2; i++) {
        const randomAngleRadians = Math.random() * Math.PI * 2;
        let velocity = (Math.random() * 3) + 0.1
        let skin = Math.floor(Math.random() * 3)

        // Kopiujemy wartości pozycji, zamiast używać tej samej referencji
        let newPosition = { x: position.x, y: position.y };

        gameArr.push(new GameObject(img, sprite[skin], newPosition, { x: Math.cos(randomAngleRadians), y: Math.sin(randomAngleRadians) }, velocity, type))
    }
    console.log(gameArr);

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

