import { gameObjectsArr, loadGameObjects, ship } from './modules/store.ts'
import { keysEvent } from './utils.ts';


const speed = document.getElementById('speed') as HTMLElement
const canvas = document.getElementById('app') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 1200;
canvas.height = 800;
let mapWidth = canvas.width
let mapHeight = canvas.height


let lastTime = 0;

const gameLoop = (timestamp: number) => {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateGame(deltaTime);

    drawGame(ctx);

    setTimeout(requestAnimationFrame, 1000 / 60, gameLoop);
};


loadGameObjects()
    .then(() => {
        keysEvent()
        requestAnimationFrame(gameLoop);
    })
    .catch((error) => {
        console.error('Błąd podczas ładowania gry:', error);
    });



function drawGame(ctx: CanvasRenderingContext2D) {
    ship.draw(ctx)
    gameObjectsArr.forEach(element => {
        element.draw(ctx)
    });
    speed.innerText = ship.velocity.toFixed(2);
}

function updateGame(deltaTime: number) {
    ship.positionUpdate()
    gameObjectsArr.forEach(element => {
        element.positionUpdate()
    });
}

export { mapWidth, mapHeight }








