import { Frame, Position, Vector, spriteSheetData, img, gameObjectsArr, ship } from './store'
import { addChildrenObject, outsideMapCheck } from '../utils';
import { mapHeight, mapWidth } from '../main';


class GameObject {
  image: HTMLImageElement;
  visualData: Frame;
  position: Position
  direction: Vector
  velocity: number
  type: string
  collisionDistance: number

  constructor(image: HTMLImageElement, visualData: Frame, position: Position, direction: Vector, velocity: number, type: string, collision: number) {
    this.image = image
    this.visualData = visualData
    this.position = position
    this.direction = direction
    this.velocity = velocity
    this.type = type
    this.collisionDistance = collision
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
    this.position.x += this.direction.x * this.velocity
    this.position.y += this.direction.y * this.velocity

    let position = outsideMapCheck(this.position.x, this.position.y)

    this.position.x = position.x
    this.position.y = position.y
  }
  destruction() {
    switch (this.type) {
      case "Big":
        ship.score += 20
        this.vanishingAndHTMLUpdate()
        addChildrenObject(gameObjectsArr, img, spriteSheetData.mediumRock, this.position, "Medium", 30)
        break;
      case "Medium":
        ship.score += 50
        this.vanishingAndHTMLUpdate()
        addChildrenObject(gameObjectsArr, img, spriteSheetData.smallRock, this.position, "Small", 17)
        break;
      case "Small":
        ship.score += 100
        this.vanishingAndHTMLUpdate()
        break;
    }
  }
  vanishingAndHTMLUpdate() {
    const index = gameObjectsArr.indexOf(this);
    if (index !== -1) {
      gameObjectsArr.splice(index, 1);
    }
    document.getElementById("score")!.innerHTML = ship.score.toString()
  }

}

export { GameObject }
