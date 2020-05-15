// dentidoo, the dentist's favourite game !

// ***********************************************
// global variables
// ***********************************************

var DEBUG = true; // display debug info

// Board definition; levels are defined in companion file "levels.js"
var BOARD_EMPTY = ".";
var BOARD_WALL = "#";
var BOARD_START = "S";
var BOARD_END = "E";
var BOARD_CANDY = "c";
var BOARD_CHOCOLATE = "h";
var BOARD_LOLLIPOP = "l";
var BOARD_TOOTHBRUSH = "T";

var GRID_SIZE = 50;
var GRID_DIMENSION = 10; // 10 * 10
var CANVAS_MARGIN = 0; // left, right, bottom margin
var CANVAS_HEADER_HEIGHT = 60;
var CANVAS_FOOTER_HEIGTH = 50; // for logo and debug info
var CANVAS_WIDTH = CANVAS_MARGIN + GRID_SIZE * GRID_DIMENSION + CANVAS_MARGIN;
var CANVAS_HEIGTH =
  CANVAS_HEADER_HEIGHT +
  GRID_SIZE * GRID_DIMENSION +
  CANVAS_MARGIN +
  CANVAS_FOOTER_HEIGTH;

var SCORE_INCREMENT = 20;
var SCORE_NOMINAL_TIME = 20 * 1000; // time to get SCORE_INCREMENT

var level = 0;
var score = 0;
var numMoves = 0;
var arrowKeysPressed = 0;
var stopped = false;
var entities = Create2DArray(GRID_DIMENSION);
var scoreText;
var levelText;
var levelNameText;

// ***********************************************
// init Crafty
// ***********************************************
Crafty.init(CANVAS_WIDTH, CANVAS_HEIGTH, document.getElementById("dentidoo"));

// For some reason loading the sprites with Crafty.load with external url does not work...
/*
var assetsObj = {
  sprites: {
    //"tooth.png":{
    "https://drive.google.comuc?export=download&id=1RvyS8xVJY5KdsK0EtVYBDWxmXejO2XpT": {
      tile: 50,
      tileh: 50,
      map: {
        tooth_0: [0, 0],
        tooth_1: [1, 0],
        tooth_2: [2, 0],
        tooth_3: [3, 0],
        tooth_4: [4, 0],
      },
    },
    //"symbols.png":{
    "https://drive.google.com/uc?export=download&id=1JWZsGg42efWXjv4ZLhScKYxb6vAEwIiY":{
      tile: 50,
      tileh: 50,
      map: {
        ball_grey: [0, 0], // empty board cell
        ball_green: [1, 0], // exit unlocked
        ball_red: [2, 0], // exit locked
        chocolate: [3, 0],
        candy: [4, 0],
        lollipop: [5, 0],
        toothbrush: [6, 0],
        wall: [7, 0],
      },
    },
  },
};

/*Crafty.load(assetsObj,
  function () {
      Crafty.scene("main"); // start the main scene when loaded
  },
  function (e) { // progress
    console.log(e);
  },
  function(e) { // error
    console.log(e);
  });
*/

// loading with Crafty.sprite works well though

Crafty.sprite(
  50, // tile
  50, // tileh
  //"tooth.png",
  "https://drive.google.com/uc?export=download&id=1RvyS8xVJY5KdsK0EtVYBDWxmXejO2XpT",
  {
    tooth_0: [0, 0],
    tooth_1: [1, 0],
    tooth_2: [2, 0],
    tooth_3: [3, 0],
    tooth_4: [4, 0],
  }
);
Crafty.sprite(
  50, // tile
  50, // tileh
  // symbols.png
  "https://drive.google.com/uc?export=download&id=1JWZsGg42efWXjv4ZLhScKYxb6vAEwIiY",
  {
    ball_grey: [0, 0], // empty board cell
    ball_green: [1, 0], // exit unlocked
    ball_red: [2, 0], // exit locked
    chocolate: [3, 0],
    candy: [4, 0],
    lollipop: [5, 0],
    toothbrush: [6, 0],
    wall: [7, 0],
  }
);



// ***********************************************
// functions
// ***********************************************

// create 2D array
function Create2DArray(rows) {
  var arr = [];
  for (var i = 0; i < rows; i++) {
    arr[i] = [];
  }
  return arr;
}

// convert x in grid to pixel position
function pos_x(x) {
  return CANVAS_MARGIN + GRID_SIZE * x;
}

// convert y in grid to pixel position
function pos_y(y) {
  return CANVAS_HEADER_HEIGHT + GRID_SIZE * y;
}

// draw header
function drawHeader() {
  scoreText = Crafty.e("2D, DOM, Text, Persists")
    .attr({
      x: CANVAS_WIDTH - 80,
      y: 10,
      w: 50,
    })
    .textFont({
      size: "25px",
    })
    .text(function () {
      return score.toString();
    })
    .dynamicTextGeneration(true);

  levelText = Crafty.e("2D, DOM, Text")
    .attr({
      x: 10,
      y: 10,
      w: 50,
    })
    .textFont({
      size: "25px",
    })
    .text(function () {
      return (level + 1).toString();
    })
    .dynamicTextGeneration(false);

  levelNameText = Crafty.e("2D, DOM, Text")
    .attr({
      x: 60,
      y: 10,
      w: 400,
    })
    .textFont({
      size: "25px",
    })
    .text(function () {
      return levels[level]["name"];
    })
    .dynamicTextGeneration(false);
}

// draw footer
function drawFooter() {
  var logo = Crafty.e("2D, DOM, Image")
    .image(
      "https://drive.google.com/uc?export=download&id=1AbQ2KQR0Q-JLb4wcFMsKuiVR-Y2Poom2"
    )
    .attr({ x: CANVAS_WIDTH - 175, y: CANVAS_HEIGTH - 50 });

  if (DEBUG) {
    Crafty.e("2D, DOM, Text")
      .attr({ x: 0, y: CANVAS_HEIGTH - 15 })
      .text(function () {
        return "numMoves:" + numMoves;
      })
      .dynamicTextGeneration(true)
      .textColor("#FF0000");
  }
  if (DEBUG && 0) {
    Crafty.e("2D, DOM, Text")
      .attr({ x: 100, y: CANVAS_HEIGTH - 15 })
      .text(function () {
        return "arrowKeysPressed:" + arrowKeysPressed;
      })
      .dynamicTextGeneration(true)
      .textColor("#FF0000");
  }
}

// draw board (populate entities)
function drawBoard() {
  for (let j = 0; j < GRID_DIMENSION; j++) {
    // j = y
    for (let i = 0; i < GRID_DIMENSION; i++) {
      // i = x
      element = levels[level]["grid"][j].charAt(i);
      switch (element) {
        case BOARD_EMPTY:
        default:
          entities[i][j] = Crafty.e("2D, DOM, ball_grey");
          break;
        case BOARD_WALL:
          entities[i][j] = Crafty.e("2D, DOM, wall");
          break;
        case BOARD_END:
          entities[i][j] = Crafty.e("2D, DOM, ball_green"); // initially the exit is unlocked
          break;
        case BOARD_CANDY:
          entities[i][j] = Crafty.e("2D, DOM, candy");
          break;
        case BOARD_CHOCOLATE:
          entities[i][j] = Crafty.e("2D, DOM, chocolate");
          break;
        case BOARD_LOLLIPOP:
          entities[i][j] = Crafty.e("2D, DOM, lollipop");
          break;
        case BOARD_TOOTHBRUSH:
          entities[i][j] = Crafty.e("2D, DOM, toothbrush");
          break;
      }
      entities[i][j].attr({
        x: pos_x(i),
        y: pos_y(j),
      });
    }
  }
  // quick patch
  for (let j = 0; j < GRID_DIMENSION; j++) {
    // j = y
    for (let i = 0; i < GRID_DIMENSION; i++) {
      // i = x
      element = levels[level]["grid"][j].charAt(i);
      switch (element) {
        case BOARD_START:
          // put a grey ball
          entities[i][j] = Crafty.e("2D, DOM, ball_grey");
          // and place one tooth in front of it
          Crafty.e("2D, DOM, tooth, tooth_0").place(i, j);
          break;
      }
      entities[i][j].attr({
        x: pos_x(i),
        y: pos_y(j),
      });
    }
  }
}

// ***********************************************
// game logic
// ***********************************************

// global keyboard events
Crafty.bind("KeyDown", function (e) {
  if (DEBUG){console.log(e.key);}
  if (stopped) {
    if (e.key == Crafty.keys.SPACE) {
      stopped = false;
      Crafty.scene("main"); // restart the scene
    }
  }
});

Crafty.scene("main", function () {
  /////////////////////////// get start time
  startTime = new Date().getTime();

  // Component for one-direction control (one move at a time, needs key before next movee,
  // and no diagonal move allowed
  Crafty.c("OneDirection", {
    required: "Keyboard",
    arrowKeysPressed: 0,
    moveRequest: { left: false, right: false, up: false, down: false },
    events: {
      KeyUp: function (e) {
        if (
          e.key == Crafty.keys.LEFT_ARROW || 
          e.key == Crafty.keys.RIGHT_ARROW ||
          e.key == Crafty.keys.UP_ARROW ||
          e.key == Crafty.keys.DOWN_ARROW ||
          e.key == Crafty.keys.S || 
          e.key == Crafty.keys.F || 
          e.key == Crafty.keys.E || 
          e.key == Crafty.keys.D 
        ) {
          this.arrowKeysPressed--;
        }
      },
      KeyDown: function (e) {
        if (
          e.key == Crafty.keys.LEFT_ARROW ||
          e.key == Crafty.keys.RIGHT_ARROW ||
          e.key == Crafty.keys.UP_ARROW ||
          e.key == Crafty.keys.DOWN_ARROW ||
          e.key == Crafty.keys.S || 
          e.key == Crafty.keys.F || 
          e.key == Crafty.keys.E || 
          e.key == Crafty.keys.D
        ) {
          this.arrowKeysPressed++;
        }
        // forbid diagonal moves with two arrows pressed
        if (this.arrowKeysPressed == 1) {
          // Default movement booleans to false
          this.moveRequest.right = this.moveRequest.left = this.moveRequest.down = this.moveRequest.up = false;
          switch (e.key) {
            case Crafty.keys.LEFT_ARROW:
            case Crafty.keys.S:
              this.moveRequest.left = true;
              break;
            case Crafty.keys.RIGHT_ARROW:
            case Crafty.keys.F:
              this.moveRequest.right = true;
              break;
            case Crafty.keys.UP_ARROW:
            case Crafty.keys.E:
              this.moveRequest.up = true;
              break;
            case Crafty.keys.DOWN_ARROW:
            case Crafty.keys.D:
              this.moveRequest.down = true;
              break;
          }
        }
      },
    },
  });

  // Component for one tooth
  Crafty.c("tooth", {
    required: "2D, DOM, OneDirection",
    init: function () {
      this.w = 50;
      this.h = 50;
    },
    place: function (ax, ay) {
      this.tooth_x = ax;
      this.tooth_y = ay;
      this.x = pos_x(ax);
      this.y = pos_y(ay);
      return this;
    },
    events: {
      UpdateFrame: function () {
        if (!stopped) {
          let newTooth_x = this.tooth_x;
          let newTooth_y = this.tooth_y;
          if (
            this.moveRequest.left ||
            this.moveRequest.right ||
            this.moveRequest.up ||
            this.moveRequest.down
          ) {
            numMoves++;
            if (this.moveRequest.left) {
              if (this.tooth_x > 0) {
                newTooth_x--;
              }
            } else if (this.moveRequest.right) {
              if (this.tooth_x < GRID_DIMENSION - 1) {
                newTooth_x++;
              }
            } else if (this.moveRequest.up) {
              if (this.tooth_y > 0) {
                newTooth_y--;
              }
            } else if (this.moveRequest.down) {
              if (this.tooth_y < GRID_DIMENSION - 1) {
                newTooth_y++;
              }
            }
            // consume the move request
            this.moveRequest.right = this.moveRequest.left = this.moveRequest.down = this.moveRequest.up = false;
            // validate new position only if we don't enter a wall
            if (!entities[newTooth_x][newTooth_y].has("wall")) {
              this.place(newTooth_x, newTooth_y);

              // check hit symbols
              if (
                entities[this.tooth_x][this.tooth_y].has("candy") ||
                entities[this.tooth_x][this.tooth_y].has("chocolate") ||
                entities[this.tooth_x][this.tooth_y].has("lollipop")
              ) {
                // make symbol disappear, replaced by empty cell
                if (entities[this.tooth_x][this.tooth_y].has("candy")) {
                  entities[this.tooth_x][this.tooth_y].toggleComponent(
                    "candy,    ball_grey"
                  );
                }
                if (entities[this.tooth_x][this.tooth_y].has("chocolate")) {
                  entities[this.tooth_x][this.tooth_y].toggleComponent(
                    "chocolate,ball_grey"
                  );
                }
                if (entities[this.tooth_x][this.tooth_y].has("lollipop")) {
                  entities[this.tooth_x][this.tooth_y].toggleComponent(
                    "lollipop, ball_grey"
                  );
                }
                // one more carie
                if (this.has("tooth_0")) {
                  this.toggleComponent("tooth_0,tooth_1");
                  // change end symbol to red
                  Crafty("ball_green").toggleComponent("ball_green,ball_red");
                } else if (this.has("tooth_1")) {
                  this.toggleComponent("tooth_1,tooth_2");
                } else if (this.has("tooth_2")) {
                  this.toggleComponent("tooth_2,tooth_3");
                } else if (this.has("tooth_3")) {
                  this.toggleComponent("tooth_3,tooth_4");
                } else if (this.has("tooth_4")) {
                  // game over
                  levelNameText.text("!! GAME OVER (press space)");
                  levelNameText.textColor("red");
                  stopped = true;
                  // score penalty
                  score -= SCORE_INCREMENT;
                }
              } else if (
                entities[this.tooth_x][this.tooth_y].has("toothbrush")
              ) {
                // make symbol disappear, replaced by empty cell
                entities[this.tooth_x][this.tooth_y].toggleComponent(
                  "toothbrush,ball_grey"
                );
                // remove one carie
                if (this.has("tooth_1")) {
                  this.toggleComponent("tooth_1,tooth_0");
                  // change end symbol to green
                  Crafty("ball_red").toggleComponent("ball_red,ball_green");
                } else if (this.has("tooth_2")) {
                  this.toggleComponent("tooth_2,tooth_1");
                } else if (this.has("tooth_3")) {
                  this.toggleComponent("tooth_3,tooth_2");
                } else if (this.has("tooth_4")) {
                  this.toggleComponent("tooth_4,tooth_3");
                }
              } else if (
                entities[this.tooth_x][this.tooth_y].has("ball_green")
              ) {
                // User wins!
                levelNameText.text("Yeah!! (press space)");
                levelNameText.textColor("green");
                stopped = true;
                // increase score
                endTime = new Date().getTime(); // milliseconds
                score += Math.round(
                  (SCORE_INCREMENT * SCORE_NOMINAL_TIME) / (endTime - startTime)
                );
                if (level < levels.length - 1) {
                  level++;
                } else {
                  level = 0; // restart from first level
                }
              }
            }
          }
        }
      },
    },
  });

  drawHeader();
  drawBoard();
  drawFooter();
});

Crafty.scene("main");