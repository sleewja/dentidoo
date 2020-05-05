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
var tooth_x = 0; // x position in the grid: 0(left)..GRID_DIMENSION-1
var tooth_y = 0; // y position in the grid: 0(top)..GRID_DIMENSION-1
var entities = Create2DArray(GRID_DIMENSION);

// ***********************************************
// init Crafty
// ***********************************************
var assetsObj = {
  sprites: {
    "tooth.png": {
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
    "symbols.png": {
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

Crafty.init(CANVAS_WIDTH, CANVAS_HEIGTH, document.getElementById("dentidoo"));
Crafty.load(assetsObj, function () {
  Crafty.scene("main"); // start the main scene when loaded
});

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

// ***********************************************
// start game
// ***********************************************
Crafty.scene("main", function () {
  /////////////////////////// get start time
  startTime = new Date().getTime();

  /////////////////////////// header
  var scoreText = Crafty.e("2D, DOM, Text, Persists")
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

  var levelText = Crafty.e("2D, DOM, Text")
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

  var levelNameText = Crafty.e("2D, DOM, Text")
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

  /////////////////////////////// footer
  var logo = Crafty.e("2D, DOM, Image")
    .image("logo.png")
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

  /////////////////////////// draw board
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
        case BOARD_START: // set start position of the tooth
          tooth_x = i;
          tooth_y = j;
          // and put a grey ball
          entities[i][j] = Crafty.e("2D, DOM, ball_grey");
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

  /////////////////////////// player entity (tooth)
  var keyboardPlayer = Crafty.e("2D, DOM, Keyboard, tooth_0")
    .attr({ x: pos_x(tooth_x), y: pos_y(tooth_y), w: 50, h: 50 })
    .bind("KeyUp", function (e) {
      if (
        e.key == Crafty.keys.LEFT_ARROW ||
        e.key == Crafty.keys.RIGHT_ARROW ||
        e.key == Crafty.keys.UP_ARROW ||
        e.key == Crafty.keys.DOWN_ARROW
      ) {
        arrowKeysPressed--;
      }
    })
    .bind("KeyDown", function (e) {
      if (
        e.key == Crafty.keys.LEFT_ARROW ||
        e.key == Crafty.keys.RIGHT_ARROW ||
        e.key == Crafty.keys.UP_ARROW ||
        e.key == Crafty.keys.DOWN_ARROW
      ) {
        arrowKeysPressed++;
      }

      if (stopped) {
        if (e.key == Crafty.keys.SPACE) {
          stopped = false;
          Crafty.scene("main"); // restart the scene
        }
      } else {
        let newTooth_x = tooth_x;
        let newTooth_y = tooth_y;
        if (arrowKeysPressed == 1) {
          // forbid diagonal moves with two arrows pressed
          numMoves++;
          switch (e.key) {
            case Crafty.keys.LEFT_ARROW:
              if (tooth_x > 0) {
                newTooth_x--;
              }
              break;
            case Crafty.keys.RIGHT_ARROW:
              if (tooth_x < GRID_DIMENSION - 1) {
                newTooth_x++;
              }
              break;
            case Crafty.keys.UP_ARROW:
              if (tooth_y > 0) {
                newTooth_y--;
              }
              break;
            case Crafty.keys.DOWN_ARROW:
              if (tooth_y < GRID_DIMENSION - 1) {
                newTooth_y++;
              }
              break;
          }
          // validate new position only if we don't enter a wall
          if (!entities[newTooth_x][newTooth_y].has("wall")) {
            tooth_x = newTooth_x;
            tooth_y = newTooth_y;
            this.x = pos_x(tooth_x);
            this.y = pos_y(tooth_y);

            // check hit symbols
            if (
              entities[tooth_x][tooth_y].has("candy") ||
              entities[tooth_x][tooth_y].has("chocolate") ||
              entities[tooth_x][tooth_y].has("lollipop")
            ) {
              // make symbol disappear, replaced by empty cell
              if (entities[tooth_x][tooth_y].has("candy")) {
                entities[tooth_x][tooth_y].toggleComponent(
                  "candy,    ball_grey"
                );
              }
              if (entities[tooth_x][tooth_y].has("chocolate")) {
                entities[tooth_x][tooth_y].toggleComponent(
                  "chocolate,ball_grey"
                );
              }
              if (entities[tooth_x][tooth_y].has("lollipop")) {
                entities[tooth_x][tooth_y].toggleComponent(
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
            } else if (entities[tooth_x][tooth_y].has("toothbrush")) {
              // make symbol disappear, replaced by empty cell
              entities[tooth_x][tooth_y].toggleComponent(
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
            } else if (entities[tooth_x][tooth_y].has("ball_green")) {
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
    });
});
