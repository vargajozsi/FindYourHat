const prompt = require("prompt-sync")({ sigint: true });
const readline = require("readline");
const blank = "\n".repeat(process.stdout.rows);

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.field2;
    this.success = 0;
    this.x = 0;
    this.y = 0;
    this.height = 3;
    this.width = 3;
  }

  generateField(h, w, p) {
    this.field2 = Array.from(Array(h), () => new Array(w));
    let holeRate = Math.ceil(h * w * (p / 100));
    //let patternField = [hole, fieldCharacter];

    //--fill up with feldcharacter
    for (let i = 0; i < this.field2.length; i++) {
      for (let j = 0; j < this.field2[i].length; j++) {
        this.field2[i][j] = fieldCharacter;
      }
    }
    //--fill up with hole character
    do  {
      let xArray = Math.floor(Math.random() * this.field2.length);
      let yArray = Math.floor(Math.random() * this.field2[0].length);
      //--check of pathhcaracterposition
      if (xArray || yArray) {
          this.field2[xArray][yArray] = hole;
      }
    } while (this.field2.flat().filter(element => element === hole).length < holeRate);
    console.log(holeRate);
    //--add path beginn 
    this.field2[0][0] = pathCharacter;
    //--add Hat charachter to the random free position
    let noPass = true;
    while (noPass) {
    let xArray2 = Math.floor(Math.random() * this.field2.length);
    let yArray2 = Math.floor(Math.random() * this.field2[0].length);
    if (this.field2[xArray2][yArray2] === fieldCharacter) {
        this.field2[xArray2][yArray2] =  hat;
        noPass = false;
    }
}




    this.field2.forEach((element) => {
        console.log(...element);
      });
      console.log();
  }

  print() {
    //console.log(blank);
    //readline.cursorTo(process.stdout, 0, 0);
    //readline.clearScreenDown(process.stdout);

    this.field.forEach((element) => {
      console.log(...element);
    });
  }

  reDrawFeld(x, y) {
    this.field[x][y] = pathCharacter;
    this.print();
  }

  warningOutOfBound() {
    console.log("Out of bound... end of game");
    this.success = 1;
  }

  gameWin() {
    console.log("Success!!! You found your hat.");
    this.success = 1;
  }

  findHole() {
    console.log("You fell down a hole... end of game");
    this.success = 1;
  }

  newUserStep(direction) {
    switch (direction) {
      case "d":
        if (this.x + 1 < this.field.length) {
          this.x++;
          switch (this.field[this.x][this.y]) {
            case hat:
              this.gameWin();
              break;
            case hole:
              this.findHole();
              break;
            case fieldCharacter:
              this.reDrawFeld(this.x, this.y);
              break;
            case pathCharacter:
              this.reDrawFeld(this.x, this.y);
              break;
          }
        } else {
          this.warningOutOfBound();
          return this.success;
        }

        break;
      case "u":
        if (this.x - 1 >= 0) {
          this.x--;
          switch (this.field[this.x][this.y]) {
            case hat:
              this.gameWin();
              break;
            case hole:
              this.findHole();
              break;
            case fieldCharacter:
              this.reDrawFeld(this.x, this.y);
              break;
            case pathCharacter:
              this.reDrawFeld(this.x, this.y);
              break;
          }
        } else {
          this.warningOutOfBound();
        }
        break;
      case "l":
        if (this.y - 1 >= 0) {
          this.y--;
          switch (this.field[this.x][this.y]) {
            case hat:
              this.gameWin();
              break;
            case hole:
              this.findHole();
              break;
            case fieldCharacter:
              this.reDrawFeld(this.x, this.y);
              break;
            case pathCharacter:
              this.reDrawFeld(this.x, this.y);
              break;
          }
        } else {
          this.warningOutOfBound();
        }
        break;
      case "r":
        if (this.y + 1 < this.field[0].length) {
          this.y++;
          switch (this.field[this.x][this.y]) {
            case hat:
              this.gameWin();
              break;
            case hole:
              this.findHole();
              break;
            case fieldCharacter:
              this.reDrawFeld(this.x, this.y);
              break;
            case pathCharacter:
              pathCharacter.fontcolor("red");
              this.reDrawFeld(this.x, this.y);
              break;
          }
        } else {
          this.warningOutOfBound();
        }
        break;
      default:
        console.log("You can go to 'l' 'r' 'u' 'd' only...");
    }
  }

  userQuestion() {
    this.generateField(6, 8, 30);
    this.print();
    while (!this.success) {
      const userDirection = prompt("Which way?");
      this.newUserStep(userDirection);
    }
  }
}

const myField = new Field([
  ["*", "░", "O", "O", "^"],
  ["░", "░", "░", "O", "░"],
  ["░", "O", "░", "░", "░"],
  ["░", "░", "░", "O", "░"],
  ["░", "^", "░", "░", "░"],
  ["░", "░", "░", "O", "░"],
]);
myField.userQuestion();
