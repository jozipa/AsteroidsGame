import {data, loadGameObjects, gameObjectsArr} from './modules/store.ts'


const canvas = document.getElementById('app') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 800;
canvas.height = 800;

let gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    gameObjectsArr[0].utilities.draw(ctx)
    
}

loadGameObjects()
    .then(() => {
        gameLoop();
    })
    .catch((error) => {
        console.error('Błąd podczas ładowania gry:', error);
    });



console.log(data)





   


