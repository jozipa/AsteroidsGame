import {Frame, Position} from './store'

class GameObject{
    image: HTMLImageElement;
    visualData: Frame;
    position: Position

    constructor(image: HTMLImageElement, visualData: Frame, position: Position){
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

class Ship{
  image: HTMLImageElement;
  visualData: Frame[];
  position: Position
  skin: number

  constructor(image: HTMLImageElement, visualData: Frame[], position: Position, skin: number){
      this.image = image
      this.visualData = visualData
      this.position = position
      this.skin = skin
  }

  draw(ctx: CanvasRenderingContext2D): void {
    let shipSkin = this.visualData[0]
    if(this.skin == 1){
      shipSkin = this.visualData[1]
    } 
    ctx.drawImage(
      this.image,
      shipSkin.x0,
      shipSkin.y0,
      shipSkin.w,
      shipSkin.h,
      this.position.x,
      this.position.y,
      shipSkin.w,
      shipSkin.h,
    );
  }

  
}





export {Ship, GameObject}