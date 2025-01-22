import { ship } from "./modules/store";

export function keysEvent() {
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                ship.powerOn();
                break;
            case "ArrowLeft":
                 ship.leftTurn();
                break;
            case "ArrowRight":
                 ship.rightTurn();
                break;
            case " ": // Spacja
                 ship.shoot();
                break;
        }
    });
    window.addEventListener("keyup", (event) => {
        switch (event.key) {
            case "ArrowUp":
                ship.powerOff();
                break;
            case "ArrowLeft":
                 //ship.leftTurn();
                break;
            case "ArrowRight":
                 //ship.rightTurn();
                break;
        }
    });
}

