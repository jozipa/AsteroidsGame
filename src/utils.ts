import { ship } from "./modules/store";

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

