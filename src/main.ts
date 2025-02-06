import { data, loadGameObjects, ship } from './modules/store.ts'
import { keysEvent } from './utils.ts';


const canvas = document.getElementById('app') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 800;
canvas.height = 800;


let lastTime = 0;

const gameLoop = (timestamp: number) => {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateGame(deltaTime);

    drawGame(ctx);

    requestAnimationFrame(gameLoop);
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
}

function updateGame(deltaTime: number) {
    ship.positionUpdate()
}








