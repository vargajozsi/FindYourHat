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
    this.success = 0;
    this.x = 0;
    this.y = 0;
  }
  //--generate a new field from h-w dimension
  static generateField(h, w, p) {
    let field2 = Array.from(Array(h), () => new Array(w));
    //calculate the hole rate from parameter p
    let holeRate = Math.ceil(h * w * (p / 100));
    //let patternField = [hole, fieldCharacter];

    //--fill up the field with feldcharacter
    for (let i = 0; i < field2.length; i++) {
      for (let j = 0; j < field2[i].length; j++) {
        field2[i][j] = fieldCharacter;
      }
    }
    //--fill up the field with hole character in specified proportion
    do {
      let xArray = Math.floor(Math.random() * field2.length);
      let yArray = Math.floor(Math.random() * field2[0].length);
      //--check of pathhcaracterposition
      if (xArray || yArray) {
        field2[xArray][yArray] = hole;
      } else {
      }
    } while (
      field2.flat().filter((element) => element === hole).length < holeRate
    );

    //--add Hat charachter to the random free position
    let noPass = true;
    while (noPass) {
      let xArray2 = Math.floor(Math.random() * field2.length);
      let yArray2 = Math.floor(Math.random() * field2[0].length);
      if (field2[xArray2][yArray2] === fieldCharacter) {
        field2[xArray2][yArray2] = hat;
        noPass = false;
      }
    }

    return field2;
  }
  //static method to clear the screen
  static clear() {
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }

  //print the field array in squer format
  print() {
    Field.clear();
    this.field.forEach((element) => {
      console.log(...element);
    });
  }

  //draw pathcharacter to the last step
  reDrawFeld(x, y) {
    this.field[x][y] = pathCharacter;
    this.print();
  }

  //warning of out of bound
  warningOutOfBound() {
    console.log("Out of bound... end of game");
    this.success = 1;
  }
  // warning of success
  gameWin() {
    console.log("Success!!! You found your hat.");
    this.success = 1;
  }
  //warning of lalling down a hole
  findHole() {
    console.log("You fell down a hole... end of game");
    this.success = 1;
  }

  //calc a new step from user entered direction
  newUserStep(direction) {
    //--lets go
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

  // hard mode modification on the field -- calc the place of hole and drawing
  letHardMode() {
    let noPass = true;
    while (noPass) {
      let xArray2 = Math.floor(Math.random() * this.field.length);
      let yArray2 = Math.floor(Math.random() * this.field[0].length);
      if (this.field[xArray2][yArray2] === fieldCharacter) {
        this.field[xArray2][yArray2] = hole;
        noPass = false;
      }
    }
  }

  //the main function of game
  userQuestion() {
    //--add a startposition
    let noPass = true;
    while (noPass) {
      let xArray2 = Math.floor(Math.random() * this.field.length);
      let yArray2 = Math.floor(Math.random() * this.field[0].length);
      if (this.field[xArray2][yArray2] === fieldCharacter) {
        this.field[xArray2][yArray2] = pathCharacter;
        this.x = xArray2;
        this.y = yArray2;
        noPass = false;
      }
    }
    Field.clear();
    //--is hard mode?
    const hardMode = prompt("Do you play hard mode (y/n)? ");

    //--print the field
    this.print();

    //--repeat question til success
    while (!this.success) {
      const userDirection = prompt("Which way (d/u/r/l)? ");
      this.newUserStep(userDirection);
      if (hardMode === "y") this.letHardMode();
    }
  }
}

//create an instance of Feld - generatefield parameters: (height, width, percent of hole)
const myField = new Field(Field.generateField(10, 10, 10));
//call the starter method
myField.userQuestion();
