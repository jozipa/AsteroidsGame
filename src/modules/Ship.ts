import { Frame, Position, spriteSheetData, img, gameObjectsArr } from './store'
import { outsideMapCheck } from '../utils';
import { mapWidth, mapHeight } from '../main';
import { Bullet } from './Bullet';

class Ship {
    private image: HTMLImageElement;
    private visualData: Frame[];
    private position: Position
    public skin: number
    private rotation: number = 0; // Kąt obrotu w radianach
    public rotationDirection: number = 0 //  -1 - lewo  0 - brak   1 - prawo  
    public velocity: number = 0
    private flightDirection: number = 0
    public bullets: Bullet[] = []
    private hitBoxes: Position[] = []
    public lives: number = 3
    public crashed: Boolean = false
    public score: number = 0

    constructor(image: HTMLImageElement, visualData: Frame[], position: Position, skin: number) {
        this.image = image
        this.visualData = visualData
        this.position = position
        this.skin = skin
    }
    // Rysuj Statek
    draw(ctx: CanvasRenderingContext2D): void {
        let shipSkin = this.visualData[this.skin];

        ctx.save(); // Zachowaj stan kontekstu

        // Ustawienie punktu obrotu na środek statku
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);

        // Rysowanie statku
        ctx.drawImage(
            this.image,
            shipSkin.x0,
            shipSkin.y0,
            shipSkin.w,
            shipSkin.h,
            -shipSkin.w / 2,
            -shipSkin.h / 2,
            shipSkin.w,
            shipSkin.h
        );
        ctx.restore(); // Przywróć stan canvasu

        // Rysowanie pocisków
        this.bullets.forEach((bullet) => bullet.draw(ctx));
    }

    // Poruszanie statku
    positionUpdate() {
        if (this.velocity > 0.01) {
            this.velocity -= 0.02  //prędkosc maleje jesli juz jakas jest  
        }
        if (this.velocity < 0.01) this.velocity = 0; //aby prędkościometr niepokazywał ujemnych liczb 

        if (this.rotationDirection == 1) {
            this.rotation += Math.PI / 45; // Obrót o 4 stopien w prawo 
        } else if (this.rotationDirection == -1) {
            this.rotation -= Math.PI / 45; // Obrót o 4 stopien w lewo
        }


        if (this.skin == 1 && !this.crashed) {
            // Wktor kierunku lotu
            let flightVector = {
                x: Math.cos(this.flightDirection) * this.velocity,
                y: Math.sin(this.flightDirection) * this.velocity
            };
            // Wektor kierunku obrotu
            let rotationVector = {
                x: Math.cos(this.rotation) * 0.1,
                y: Math.sin(this.rotation) * 0.1
            };
            // Z Updateowany wektor kierunku lotu
            let finalVector = {
                x: flightVector.x + rotationVector.x,
                y: flightVector.y + rotationVector.y
            }
            function vectorToAngle(x: number, y: number) {
                return Math.atan2(y, x); // Zwraca kąt w radianach
            }
            this.flightDirection = vectorToAngle(finalVector.x, finalVector.y)

            this.velocity = Math.sqrt(finalVector.x ** 2 + finalVector.y ** 2);  // przyspieszanie jeśli statek dodaje gazu

            if (this.velocity > 10) this.velocity = 10
        }

        this.position.y += Math.sin(this.flightDirection) * this.velocity
        this.position.x += Math.cos(this.flightDirection) * this.velocity

        //sprawdzanie i korygacja gdy poza mapą, jeśli nie został właśnie rozbity
        if (!this.crashed) {
            let position = outsideMapCheck(this.position.x, this.position.y)
            this.position.x = position.x
            this.position.y = position.y
        }

        //ustalanie hitboxów
        this.hitBoxes = []
        this.hitBoxes.push({ x: (this.position.x + Math.cos(this.rotation) * 32), y: (this.position.y + Math.sin(this.rotation) * 32) }) //dziób
        this.hitBoxes.push({ x: (this.position.x - Math.cos(this.rotation) * 16) + Math.cos(this.rotation + (Math.PI / 2)) * 16, y: (this.position.y - Math.sin(this.rotation) * 16) + Math.sin(this.rotation + (Math.PI / 2) * 16) })
        this.hitBoxes.push({ x: (this.position.x - Math.cos(this.rotation) * 16) - Math.cos(this.rotation + (Math.PI / 2)) * 16, y: (this.position.y - Math.sin(this.rotation) * 16) - Math.sin(this.rotation + (Math.PI / 2) * 16) })


        this.bullets.forEach((bullet) => bullet.positionUpdate());
        this.bullets = this.bullets.filter((bullet) => bullet.alive);

        this.colisionsCheck()
    }

    // sprawdzanie kolizji z asteroidami
    colisionsCheck() {
        gameObjectsArr.forEach(asteroid => {
            this.hitBoxes.forEach(top => {
                let distance = Math.sqrt((top.x - asteroid.position.x) ** 2 + (top.y - asteroid.position.y) ** 2)
                if (distance <= asteroid.collisionDistance) {
                    asteroid.destruction()
                    this.collision()
                }
            });
        });
    }

    // obsługa kolizji
    collision() {
        this.crashed = true
        this.position.x = mapWidth * 5
        this.position.y = mapHeight * 5
        this.lives -= 1
        this.velocity = 0
        document.getElementById("livesLeft")!.innerHTML = this.lives.toString()
        if (this.lives > 0) {
            setTimeout(() => {

                let freeSpawnPending = setInterval(() => {
                    if(this.freeSpawnCheck()){
                        clearInterval(freeSpawnPending)
                        this.respawn()
                    }
                }, 1);

            }, 2000);
        } else {
            document.getElementById("score2")!.innerHTML = this.score.toString()
            document.getElementById("gameOver")!.style.display = "block";
        }
    }

    //freeSpawnCheck
    freeSpawnCheck() {
        let dupa = true
        gameObjectsArr.forEach(asteroid => {
            let distance = Math.sqrt((mapWidth / 2 - asteroid.position.x) ** 2 + (mapHeight / 2 - asteroid.position.y) ** 2)
            if (distance <= 70) {
                console.log(distance);
                dupa = false
            }
        });
        return dupa
    }

    //obsługa strzelania
    shoot() {
        if (this.bullets.length < 3) {
            let bulletX = this.position.x + Math.cos(this.rotation) * 32
            let bulletY = this.position.y + Math.sin(this.rotation) * 32

            this.bullets.push(new Bullet(img, spriteSheetData.bullet2, { x: bulletX, y: bulletY }, { x: Math.cos(this.rotation), y: Math.sin(this.rotation) }))
        }
    }

    respawn() {
        this.position.x = mapWidth / 2
        this.position.y = mapHeight / 2
        this.rotation = 0
        this.velocity = 0
        this.flightDirection = 0
        this.crashed = false
    }
}

export { Ship }