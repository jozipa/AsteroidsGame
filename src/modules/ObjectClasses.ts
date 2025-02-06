import { Frame, Position } from './store'

class GameObject {
  image: HTMLImageElement;
  visualData: Frame;
  position: Position

  constructor(image: HTMLImageElement, visualData: Frame, position: Position) {
    this.image = image
    this.visualData = visualData
    this.position = position
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image,
      this.visualData.x0,
      this.visualData.y0,
      this.visualData.w,
      this.visualData.h,
      this.position.x,
      this.position.y,
      this.visualData.w,
      this.visualData.h,
    );
  }
}

class Ship {
  image: HTMLImageElement;
  visualData: Frame[];
  position: Position
  skin: number
  rotation: number = 0; // Kąt obrotu w radianach
  rotationDirection: number = 0 //  -1 - lewo  0 - brak   1 - prawo  
  velocity: number = 0 //  

  constructor(image: HTMLImageElement, visualData: Frame[], position: Position, skin: number) {
    this.image = image
    this.visualData = visualData
    this.position = position
    this.skin = skin
  }

  draw(ctx: CanvasRenderingContext2D): void {
    let shipSkin = this.visualData[this.skin]

    // Środek statku
    const centerX = this.position.x + shipSkin.w / 2;
    const centerY = this.position.y + shipSkin.h / 2;

    ctx.save(); // Zachowaj aktualny stan transformacji

    ctx.translate(centerX, centerY); // Przesuń układ do środka statku
    ctx.rotate(this.rotation); // Obróć canvas o wartość kąta

    ctx.drawImage(
      this.image,
      shipSkin.x0,
      shipSkin.y0,
      shipSkin.w,
      shipSkin.h,
      -shipSkin.w / 2, // Rysuj od -połowy szerokości (środek obrazu)
      -shipSkin.h / 2, // Rysuj od -połowy wysokości (środek obrazu)
      shipSkin.w,
      shipSkin.h,
    );

    ctx.restore(); // Przywróć stan canvasu
  }
  positionUpdate() {
    if (this.velocity > 0) {
      this.velocity -= 0.05  //prędkosc maleje jesli juz jakas jest
    }

    if (this.rotationDirection == 1) {
      this.rotation += Math.PI / 60; // Obrót o 3 stopien w prawo 
    } else if (this.rotationDirection == -1) {
      this.rotation -= Math.PI / 60; // Obrót o 3 stopien w lewo
    } else if (this.skin == 1) {
      this.velocity += 0.5  // przyspieszanie jeśli statek dodaje gazu
    }

    this.position.y += Math.sin(this.rotation) * this.velocity
    this.position.x += Math.cos(this.rotation) * this.velocity


  }
  shoot() {
    console.log('shooting');
  }

}


export { Ship, GameObject }