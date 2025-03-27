import { Frame, Position, Vector, gameObjectsArr, ship } from './store'
import { outsideMapCheck } from '../utils';


class Bullet {
    direction: Vector
    position: Position
    velocity: number = 20
    distance: number = 600
    alive: boolean = true
    image: HTMLImageElement
    visualData: Frame;

    constructor(image: HTMLImageElement, visualData: Frame, position: Position, direction: Vector) {
        this.image = image
        this.visualData = visualData
        this.direction = direction
        this.position = position
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);

        ctx.drawImage(
            this.image,
            this.visualData.x0,
            this.visualData.y0,
            this.visualData.w,
            this.visualData.h,
            -this.visualData.w / 2, // Przesuwamy obraz tak, aby jego środek był na (0,0)
            -this.visualData.h / 2,
            this.visualData.w,
            this.visualData.h
        );

        ctx.restore()
    }
    positionUpdate() {
        if (this.distance <= 0) this.alive = false
        this.position.x += this.direction.x * this.velocity
        this.position.y += this.direction.y * this.velocity
        this.distance -= this.velocity

        //sprawdzanie i korygacja gdy poza mapą
        if (!ship.crashed) {
            let position = outsideMapCheck(this.position.x, this.position.y)
            this.position.x = position.x
            this.position.y = position.y
        }

        //sprawdzanie trafienia
        gameObjectsArr.forEach(asteroid => {
            let distance = Math.sqrt((this.position.x - asteroid.position.x) ** 2 + (this.position.y - asteroid.position.y) ** 2)
            if (distance < asteroid.collisionDistance && this.alive) {
                this.alive = false
                asteroid.destruction()
            }
        });
    }

}

export { Bullet }