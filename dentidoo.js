// dentidoo, the dentist's favourite game !

// IDEAs:
// - shortcuts from one cell to another
// - dentist symbol: heals all caries at once

// ***********************************************
// global variables
// ***********************************************

var DEBUG = true; // display debug info

// Board definition; levels are defined in companion file "levels.js"
var BOARD_EMPTY = ".";
var BOARD_WALL = "#";
var BOARD_SPRING = "£";
var BOARD_CLOUD = "*";
var BOARD_START = "S";
var BOARD_END = "E";
var BOARD_CANDY = "c";
var BOARD_CHOCOLATE = "h";
var BOARD_LOLLIPOP = "l";
var BOARD_TOOTHBRUSH = "T";

var Z_SYMBOLS = 0; // background
var Z_TEETH = 1; // in front of symbols
var Z_CLOUD = 2; // in front of teeth
var GRID_SIZE = 50; // size in pixels
var GRID_DIMENSION = 10; // 10 * 10
var CANVAS_MARGIN = 0; // left, right, bottom margin
var CANVAS_HEADER_HEIGHT = 60;
var CANVAS_FOOTER_HEIGTH = 160; // for logo and debug info and buttons
var CANVAS_WIDTH = CANVAS_MARGIN + GRID_SIZE * GRID_DIMENSION + CANVAS_MARGIN;
var CANVAS_HEIGTH =
  CANVAS_HEADER_HEIGHT +
  GRID_SIZE * GRID_DIMENSION +
  CANVAS_MARGIN +
  CANVAS_FOOTER_HEIGTH;

var SCORE_INCREMENT = 20;
var SCORE_NOMINAL_TIME = 20 * 1000; // time to get SCORE_INCREMENT [milliseconds]

const MOVE_REQUEST = {
  NONE: "none",
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
};

var level = 0;
var score = 0;
var numMoves = 0;
var arrowKeysPressed = 0;
var moveRequest = MOVE_REQUEST.NONE;
var stopped = false;
var entities = Create2DArray(GRID_DIMENSION);
var scoreText;
var levelText;
var levelNameText;

// ***********************************************
// init Crafty
// ***********************************************
Crafty.init(CANVAS_WIDTH, CANVAS_HEIGTH, document.getElementById("dentidoo"));

Crafty.sprite(
  50, // tile
  50, // tileh
  "tooth.png",
  {
    tooth_0: [0, 0], // clean
    tooth_1: [1, 0],
    tooth_2: [2, 0],
    tooth_3: [3, 0],
    tooth_4: [4, 0],
    tooth_5: [5, 0], // broken
  }
);
Crafty.sprite(
  50, // tile
  50, // tileh
  "symbols.png",
  {
    ball_grey: [0, 0], // empty board cell
    ball_green: [1, 0], // exit unlocked
    ball_red: [2, 0], // exit locked
    chocolate: [3, 0],
    candy: [4, 0],
    lollipop: [5, 0],
    toothbrush: [6, 0],
    wall: [7, 0],
    spring: [0, 1],
    cloud: [1, 1],
  }
);
Crafty.sprite(
  100, // tile
  100, // tileh
  "buttons.png",
  {
    button_left: [0, 0],
    button_up: [1, 0],
    button_down: [2, 0],
    button_right: [3, 0],
    button_restart: [4, 0],
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

// convert i in grid to x pixel position
function pos_x(i) {
  return CANVAS_MARGIN + GRID_SIZE * i;
}

// convert x pixel position to i grid position
function pos_i(x){
  return (x - CANVAS_MARGIN) / GRID_SIZE;
}

// convert j in grid to y pixel position
function pos_y(j) {
  return CANVAS_HEADER_HEIGHT + GRID_SIZE * j;
}

// convert y pixel position to j grid position
function pos_j(y){
  return (y - CANVAS_HEADER_HEIGHT) / GRID_SIZE;
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
    .image("logo.png")
    .attr({
      x: CANVAS_WIDTH - 175,
      y: CANVAS_HEIGTH - CANVAS_FOOTER_HEIGTH,
    });

  if (DEBUG) {
    Crafty.e("2D, DOM, Text")
      .attr({
        x: 0,
        y: CANVAS_HEIGTH - CANVAS_FOOTER_HEIGTH + 15,
      })
      .text(function () {
        return "numMoves:" + numMoves;
      })
      .dynamicTextGeneration(true)
      .textColor("#FF0000");
  }
  if (DEBUG && 0) {
    Crafty.e("2D, DOM, Text")
      .attr({
        x: 100,
        y: CANVAS_HEIGTH - CANVAS_FOOTER_HEIGTH + 15,
      })
      .text(function () {
        return "arrowKeysPressed:" + arrowKeysPressed;
      })
      .dynamicTextGeneration(true)
      .textColor("#FF0000");
  }

  // buttons
  buttons_h = 100;
  buttons_y = CANVAS_HEIGTH - buttons_h;
  Crafty.e("2D, Canvas, Mouse, button_left")
    .attr({ x: 0, y: buttons_y })
    .bind("Click", function (MouseEvent) {
      if (!stopped) {
        moveRequest = MOVE_REQUEST.LEFT;
      }
    });
  Crafty.e("2D, Canvas, Mouse, button_up")
    .attr({ x: buttons_h, y: buttons_y })
    .bind("Click", function (MouseEvent) {
      if (!stopped) {
        moveRequest = MOVE_REQUEST.UP;
      }
    });
  Crafty.e("2D, Canvas, Mouse, button_down")
    .attr({ x: buttons_h * 2, y: buttons_y })
    .bind("Click", function (MouseEvent) {
      if (!stopped) {
        moveRequest = MOVE_REQUEST.DOWN;
      }
    });
  Crafty.e("2D, Canvas, Mouse, button_right")
    .attr({ x: buttons_h * 3, y: buttons_y })
    .bind("Click", function (MouseEvent) {
      if (!stopped) {
        moveRequest = MOVE_REQUEST.RIGHT;
      }
    });
  Crafty.e("2D, Canvas, Mouse, button_restart")
    .attr({ x: buttons_h * 4, y: buttons_y })
    .bind("Click", function (MouseEvent) {
      // restart this level; (same as keyboard key R)
      stopped = false;
      Crafty.scene("main"); // restart the scene
    });
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
        case BOARD_SPRING:
          entities[i][j] = Crafty.e("2D, DOM, spring");
          break;
        case BOARD_CLOUD:
          entities[i][j] = Crafty.e("2D, DOM, cloud").attr({
            z: Z_CLOUD,
          });
          break;
        case BOARD_START:
          // put a grey ball
          entities[i][j] = Crafty.e("2D, DOM, ball_grey");
          // and place one tooth in front of it
          Crafty.e("2D, DOM, tooth, tooth_0").attr({
            x: pos_x(i),
            y: pos_y(j),
            z: Z_TEETH, // in front of symbols which are at Z=0
          });
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
}

// check if position is inside the board
function isInBoard(ax, ay) {
  return ax >= 0 && ax < GRID_DIMENSION && ay >= 0 && ay < GRID_DIMENSION;
}

// return destination after moving by some steps in one direction
function moveOneStep(ax, ay, aMoveRequest, aStep) {
  switch (aMoveRequest) {
    case MOVE_REQUEST.LEFT:
      ax -= aStep;
      break;
    case MOVE_REQUEST.RIGHT:
      ax += aStep;
      break;
    case MOVE_REQUEST.UP:
      ay -= aStep;
      break;
    case MOVE_REQUEST.DOWN:
      ay += aStep;
      break;
  }
  return [ax, ay];
}

// hop on spring(s), starting from position ax,ay occupied by a spring
function hopOnSprings(ax, ay, aMoveRequest) {
  while (isInBoard(ax, ay) && entities[ax][ay].has("spring")) {
    // jump 2 positions in the requested direction
    [ax, ay] = moveOneStep(ax, ay, aMoveRequest, 2);
  }
  return [ax, ay];
}

// check and manage effects when a tooth hits a symbol at destination
function checkHitSymbols(aToothEntity, destination) {
  if (
    destination.has("candy") ||
    destination.has("chocolate") ||
    destination.has("lollipop")
  ) {
    // make symbol disappear, replaced by empty cell
    if (destination.has("candy")) {
      destination.toggleComponent("candy,    ball_grey");
    }
    if (destination.has("chocolate")) {
      destination.toggleComponent("chocolate,ball_grey");
    }
    if (destination.has("lollipop")) {
      destination.toggleComponent("lollipop, ball_grey");
    }
    // one more carie
    if (aToothEntity.has("tooth_0")) {
      aToothEntity.toggleComponent("tooth_0,tooth_1");
    } else if (aToothEntity.has("tooth_1")) {
      aToothEntity.toggleComponent("tooth_1,tooth_2");
    } else if (aToothEntity.has("tooth_2")) {
      aToothEntity.toggleComponent("tooth_2,tooth_3");
    } else if (aToothEntity.has("tooth_3")) {
      aToothEntity.toggleComponent("tooth_3,tooth_4");
    } else if (aToothEntity.has("tooth_4")) {
      // this tooth is broken
      aToothEntity.toggleComponent("tooth_4,tooth_5");
    }
  } else if (destination.has("toothbrush")) {
    // make symbol disappear, replaced by empty cell
    destination.toggleComponent("toothbrush,ball_grey");
    // remove one carie
    if (aToothEntity.has("tooth_1")) {
      aToothEntity.toggleComponent("tooth_1,tooth_0");
    } else if (aToothEntity.has("tooth_2")) {
      aToothEntity.toggleComponent("tooth_2,tooth_1");
    } else if (aToothEntity.has("tooth_3")) {
      aToothEntity.toggleComponent("tooth_3,tooth_2");
    } else if (aToothEntity.has("tooth_4")) {
      aToothEntity.toggleComponent("tooth_4,tooth_3");
    }
  }
}

// move one tooth
// returns true if the tooth has effectively moved, and false if the moveRequest
// does not move the tooth (because we hit the border, a wall, another tooth...)
function moveOneTooth(aToothEntity, aMoveRequest) {
  let oldTooth_x = pos_i(aToothEntity.x);
  let oldTooth_y = pos_j(aToothEntity.y);
  [newTooth_x, newTooth_y] = moveOneStep(
    oldTooth_x,
    oldTooth_y,
    aMoveRequest,
    1
  );
  if (isInBoard(newTooth_x, newTooth_y)) {
    destination = entities[newTooth_x][newTooth_y];
    if (destination.has("spring")) {
      [newTooth_x, newTooth_y] = hopOnSprings(
        newTooth_x,
        newTooth_y,
        aMoveRequest
      );
    }
    if (isInBoard(newTooth_x, newTooth_y)) {
      destination = entities[newTooth_x][newTooth_y];
      // validate new position only if we don't enter a wall or another tooth,
      if (!destination.has("wall") && isPositionFree(newTooth_x, newTooth_y)) {
        aToothEntity.x = pos_x(newTooth_x);
        aToothEntity.y = pos_y(newTooth_y);

        // check hit symbols
        checkHitSymbols(aToothEntity, destination);
      }
    }
  }
  return ( (newTooth_x!=oldTooth_x) && (newTooth_y!=oldTooth_y));
}

// return array of tooth entities, ordered according to one direction
function orderedTeeth(aMoveRequest) {
  var teethEntities = Crafty("tooth").get();
  teethEntities.sort(function (a, b) {
    var result;
    switch (aMoveRequest) {
      case MOVE_REQUEST.LEFT:
        result = a.x - b.x;
        break;
      case MOVE_REQUEST.RIGHT:
        result = b.x - a.x;
        break;
      case MOVE_REQUEST.UP:
        result = a.y - b.y;
        break;
      case MOVE_REQUEST.DOWN:
        result = b.y - a.y;
        break;
    }
    return result;
  });
  return teethEntities;
}

// move all teeth according to the move request
// returns true if at least one tooth has effectively moved, and false if the moveRequest
// does not move any tooth (because we hit the border, a wall, another tooth...)
function moveAllTeeth(aMoveRequest) {
  // order the teeth according to the move direction: we move first
  // the tooth which is further away in that direction to free up the
  // trail behind it.
  atLeastOneToothMoved = false;
  orderedTeeth(aMoveRequest).forEach(function(toothEntity){
      if (moveOneTooth(toothEntity, aMoveRequest)){
        atLeastOneToothMoved = true;
      }
    });
  return atLeastOneToothMoved;
}

// check if position x, y is free, i.e. not ocupied by one tooth
function isPositionFree(ax, ay) {
  var isFree = true;
  var teethEntities = Crafty("tooth").get();
  for (i = 0; i < teethEntities.length; i++) {
    if (pos_i(teethEntities[i].x) == ax && pos_j(teethEntities[i].y) == ay) {
      isFree = false;
      break;
    }
  }
  return isFree;
}

function isOneToothBroken() {
  return Crafty("tooth_5").length > 0;
}

// check if all teeth are clean, and on a green exit ball
function isAllTeethSaved() {
  var numSaved = 0;
  var teethEntities = Crafty("tooth").get();
  teethEntities.forEach(function(toothEntity){
    if (toothEntity.has("tooth_0")) {
      i = pos_i(toothEntity.x);
      j = pos_j(toothEntity.y);
      if (entities[i][j].has("ball_green")){
        numSaved++;
      }
    }
  })
  return numSaved == teethEntities.length;
}

function isAllTeethClean() {
  var numClean = Crafty("tooth_0").length;
  var numTeeth = Crafty("tooth").length;
  return numClean == numTeeth;
}

// ***********************************************
// game logic
// ***********************************************

// global keyboard events
// one-direction control (one move at a time, needs key up before next movee,
// and no diagonal move allowed

Crafty.bind("KeyDown", function (e) {
  if (DEBUG) {
    console.log("Key=" + e.key);
  }
  if (e.key == Crafty.keys.R) {
    stopped = false;
    Crafty.scene("main"); // restart the scene
  } else {
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
      arrowKeysPressed++;
    }
    // forbid diagonal moves with two arrows pressed
    if (!stopped && arrowKeysPressed == 1) {
      // By default no move request
      moveRequest = MOVE_REQUEST.NONE;
      switch (e.key) {
        case Crafty.keys.LEFT_ARROW:
        case Crafty.keys.S:
          moveRequest = MOVE_REQUEST.LEFT;
          break;
        case Crafty.keys.RIGHT_ARROW:
        case Crafty.keys.F:
          moveRequest = MOVE_REQUEST.RIGHT;
          break;
        case Crafty.keys.UP_ARROW:
        case Crafty.keys.E:
          moveRequest = MOVE_REQUEST.UP;
          break;
        case Crafty.keys.DOWN_ARROW:
        case Crafty.keys.D:
          moveRequest = MOVE_REQUEST.DOWN;
          break;
      }
    }
  }
});

Crafty.bind("KeyUp", function (e) {
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
    arrowKeysPressed--;
  }
});

Crafty.bind("UpdateFrame", function () {
  // If there is a move request: move all teeth
  // Then check:
  // - is one tooth game over? if yes replay this level
  // - are all teeth saved?    if yes go to next level
  if (moveRequest != MOVE_REQUEST.NONE) {
    numMoves++;
    moveAllTeeth(moveRequest);
    // consume the move request
    moveRequest = MOVE_REQUEST.NONE;
    if (isOneToothBroken()) {
      // game over
      levelNameText.text("!! Try again (press 'r')");
      // 'r' instead of SPACE because SPACE submits inputs in forms on the same HTML page
      levelNameText.textColor("red");
      stopped = true;
      // score penalty
      score -= SCORE_INCREMENT;
    } else if (isAllTeethSaved()) {
      // User wins!
      levelNameText.text("Yeah!! (press 'r')");
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
    } else if (isAllTeethClean()) {
      // turn the exit(s) green, if they aren't yet
      if (Crafty("ball_red").length != 0) {
        Crafty("ball_red").each(function () {
          this.toggleComponent("ball_red,ball_green");
        });
      }
    } else {
      // turn the exit(s) red, if they aren't yet
      if (Crafty("ball_green").length != 0) {
        Crafty("ball_green").each(function () {
          this.toggleComponent("ball_green,ball_red");
        });
      }
    }
  }
});

Crafty.scene("main", function () {
  startTime = new Date().getTime();
  drawHeader();
  drawBoard();
  drawFooter();
});
