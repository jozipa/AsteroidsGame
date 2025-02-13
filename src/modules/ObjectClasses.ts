import { Frame, Position, Vector, spriteSheetData, img, gameObjectsArr } from './store'
import { addChildrenObject } from '../utils';

class GameObject {
  image: HTMLImageElement;
  visualData: Frame;
  position: Position
  direction: Vector
  velocity: number
  type: string

  constructor(image: HTMLImageElement, visualData: Frame, position: Position, direction: Vector, velocity: number, type: string) {
    this.image = image
    this.visualData = visualData
    this.position = position
    this.direction = direction
    this.velocity = velocity
    this.type = type
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

    // ctx.strokeStyle = "blue";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(0, 0, 52, 0, Math.PI * 2);
    // ctx.stroke();

    ctx.restore()
  }
  positionUpdate(mapWidth: number = 800, mapHeight: number = 800) {

    this.position.x += this.direction.x * this.velocity
    this.position.y += this.direction.y * this.velocity



    if (this.position.x < -60) this.position.x = mapWidth;      // Wychodzi z lewej → pojawia się po prawej
    if (this.position.x > mapWidth) this.position.x = -60;      // Wychodzi z prawej → pojawia się po lewej
    if (this.position.y < -60) this.position.y = mapHeight;     // Wychodzi z góry → pojawia się na dole
    if (this.position.y > mapHeight) this.position.y = -60;     // Wychodzi z dołu → pojawia się na górze
  }
  destruction() {
    switch (this.type) {
      case "Big":
        const index = gameObjectsArr.indexOf(this);
        if (index !== -1) {
          gameObjectsArr.splice(index, 1);
        }
        for (let i = 0; i < 2; i++) {
          addChildrenObject(gameObjectsArr, img, spriteSheetData.mediumRock[Math.floor(Math.random() * 3)], this.position, "Medium")
        }
        break;
      case "Medium":
        const index1 = gameObjectsArr.indexOf(this);
        if (index1 !== -1) {
          gameObjectsArr.splice(index1, 1);
        }
        break;
      case "Small":

        break;

    }
  }
}

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
  positionUpdate(mapWidth: number = 800, mapHeight: number = 800) {
    if (this.distance <= 0) this.alive = false
    this.position.x += this.direction.x * this.velocity
    this.position.y += this.direction.y * this.velocity
    this.distance -= this.velocity


    if (this.position.x < -60) this.position.x = mapWidth;      // Wychodzi z lewej → pojawia się po prawej
    if (this.position.x > mapWidth) this.position.x = -60;      // Wychodzi z prawej → pojawia się po lewej
    if (this.position.y < -60) this.position.y = mapHeight;     // Wychodzi z góry → pojawia się na dole
    if (this.position.y > mapHeight) this.position.y = -60;     // Wychodzi z dołu → pojawia się na górze

    gameObjectsArr.forEach(obj => {
      let distance = Math.sqrt((this.position.x - obj.position.x) ** 2 + (this.position.y - obj.position.y) ** 2)
      if (obj.type == "Big" && distance < 52) {  // kolizja z duzymi asteroidami
        obj.destruction()
        this.alive = false
      } else if (obj.type == "Medium" && distance < 52) {  // kolizja ze średnimi asteroidami
        obj.destruction()
        this.alive = false
      }
    });

  }

}

class Ship {
  image: HTMLImageElement;
  visualData: Frame[];
  position: Position
  skin: number
  rotation: number = 0; // Kąt obrotu w radianach
  rotationDirection: number = 0 //  -1 - lewo  0 - brak   1 - prawo  
  velocity: number = 0
  flightDirection: number = 0
  bullets: Bullet[] = []


  constructor(image: HTMLImageElement, visualData: Frame[], position: Position, skin: number) {
    this.image = image
    this.visualData = visualData
    this.position = position
    this.skin = skin
  }

  draw(ctx: CanvasRenderingContext2D): void {
    let shipSkin = this.visualData[this.skin];

    ctx.save(); // Zachowaj stan kontekstu

    // Ustawienie punktu obrotu na środek statku
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    // Rysowanie statku - teraz rysujemy względem pozycji (0,0), bo przesunęliśmy układ
    ctx.drawImage(
      this.image,
      shipSkin.x0,
      shipSkin.y0,
      shipSkin.w,
      shipSkin.h,
      -shipSkin.w / 2, // Przesuwamy obraz tak, aby jego środek był na (0,0)
      -shipSkin.h / 2,
      shipSkin.w,
      shipSkin.h
    );

    ctx.restore(); // Przywróć stan canvasu

    // Rysowanie pocisków
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
  positionUpdate(mapWidth: number = 800, mapHeight: number = 800) {
    if (this.velocity > 0) {
      this.velocity -= 0.02  //prędkosc maleje jesli juz jakas jest
    }

    if (this.rotationDirection == 1) {
      this.rotation += Math.PI / 45; // Obrót o 4 stopien w prawo 
    } else if (this.rotationDirection == -1) {
      this.rotation -= Math.PI / 45; // Obrót o 4 stopien w lewo
    }


    if (this.skin == 1) {
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
      if (this.velocity > 15) this.velocity = 15
    }

    this.position.y += Math.sin(this.flightDirection) * this.velocity
    this.position.x += Math.cos(this.flightDirection) * this.velocity

    if (this.position.x < -60) this.position.x = mapWidth;      // Wychodzi z lewej → pojawia się po prawej
    if (this.position.x > mapWidth) this.position.x = -60;      // Wychodzi z prawej → pojawia się po lewej
    if (this.position.y < -60) this.position.y = mapHeight;     // Wychodzi z góry → pojawia się na dole
    if (this.position.y > mapHeight) this.position.y = -60;     // Wychodzi z dołu → pojawia się na górze

    this.bullets.forEach((bullet) => bullet.positionUpdate());
    this.bullets = this.bullets.filter((bullet) => bullet.alive);
  }
  shoot() {
    let bulletX = this.position.x + Math.cos(this.rotation) * 32
    let bulletY = this.position.y + Math.sin(this.rotation) * 32

    this.bullets.push(new Bullet(img, spriteSheetData.bullet2, { x: bulletX, y: bulletY }, { x: Math.cos(this.rotation), y: Math.sin(this.rotation) }))
  }
}


export { Ship, GameObject }
