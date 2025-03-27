import { Frame, Position, Vector, spriteSheetData, img, gameObjectsArr} from './store'
import { addChildrenObject, outsideMapCheck } from '../utils';
import { mapWidth, mapHeight } from '../main';


let scoreHtml: HTMLElement = document.getElementById('score')!
let score: number = 0

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
        console.log("BIG DESTRUCTION");

        const index = gameObjectsArr.indexOf(this);
        if (index !== -1) {
          gameObjectsArr.splice(index, 1);
        }
        score +=20
        scoreHtml.innerHTML = score.toString()
        addChildrenObject(gameObjectsArr, img, spriteSheetData.mediumRock, this.position, "Medium", 30)

        break;
      case "Medium":
        console.log("Medium Destruction");
        const index1 = gameObjectsArr.indexOf(this);
        if (index1 !== -1) {
          gameObjectsArr.splice(index1, 1);
        }
        score +=50
        scoreHtml.innerHTML = score.toString()
        addChildrenObject(gameObjectsArr, img, spriteSheetData.smallRock, this.position, "Small", 17)
        break;
      case "Small":
        console.log("small destruction");
        const index2 = gameObjectsArr.indexOf(this);
        if (index2 !== -1) {
          gameObjectsArr.splice(index2, 1);
        }
        score +=100
        scoreHtml.innerHTML = score.toString()
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
  positionUpdate() {
    if (this.distance <= 0) this.alive = false
    this.position.x += this.direction.x * this.velocity
    this.position.y += this.direction.y * this.velocity
    this.distance -= this.velocity

    //sprawdzanie i korygacja gdy poza mapą
    let position = outsideMapCheck(this.position.x, this.position.y)
    this.position.x = position.x
    this.position.y = position.y

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
  hitBoxes: Position[] = []
  lives: number = 3
  crashed: Boolean = false

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

    // // Rysowanie białych kropek w określonych punktach
    // this.drawDot(ctx, this.position.x + Math.cos(this.rotation) * 32, this.position.y + Math.sin(this.rotation) * 32);//dziób
    // //pozycja srodka - cosinus rotacji razy odleglosc(ta sama prosta)+cos rotacji +90 aby trafić pod kątem prostym na róg statku
    // this.drawDot(ctx, (this.position.x - Math.cos(this.rotation) * 16) + Math.cos(this.rotation + (Math.PI / 2)) * 16, (this.position.y - Math.sin(this.rotation) * 16) + Math.sin(this.rotation + (Math.PI / 2)) * 16);
    // this.drawDot(ctx, (this.position.x - Math.cos(this.rotation) * 16) - Math.cos(this.rotation + (Math.PI / 2)) * 16, (this.position.y - Math.sin(this.rotation) * 16) - Math.sin(this.rotation + (Math.PI / 2)) * 16);

  }

  // Funkcja pomocnicza do rysowania kropek
  drawDot(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2); // Kropka o promieniu 3
    ctx.fill();
  }

  positionUpdate() {
    if (this.velocity > 0) {
      this.velocity -= 0.02  //prędkosc maleje jesli juz jakas jest  
    }

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
    if(!this.crashed){
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
  collision(){
    this.crashed = true
    this.position.x = mapWidth*5
    this.position.y = mapHeight*5
    this.lives -= 1
    this.velocity = 0
    document.getElementById("livesLeft")!.innerHTML = this.lives.toString()
    if (this.lives>0){
      setTimeout(() => {
        this.reset()
      }, 2000);
    } else {
      document.getElementById("score2")!.innerHTML = score.toString()
      document.getElementById("gameOver")!.style.display = "block";
    }
  }
  shoot() {
    console.log('shoooot', gameObjectsArr);
    if(this.bullets.length<3){
      let bulletX = this.position.x + Math.cos(this.rotation) * 32
      let bulletY = this.position.y + Math.sin(this.rotation) * 32
  
      this.bullets.push(new Bullet(img, spriteSheetData.bullet2, { x: bulletX, y: bulletY }, { x: Math.cos(this.rotation), y: Math.sin(this.rotation) }))
    }
  }
  reset(){
    this.position.x = 600
    this.position.y = 400
    this.rotation = 0
    this.velocity = 0
    this.flightDirection = 0
    this.crashed = false
  }
}


export { Ship, GameObject }
