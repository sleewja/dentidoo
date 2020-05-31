// Basic Backtracking solver, but looks more like brute force. Very slow...

var MAX_MOVES = 50; // max moves in one solution

var numRecursiveCalls = 0;
var findAtMostOneSolution = true;
var solutions = []; // array of solutions. Each solution is a sequence of moves
var sequenceOfMoves = [];

// generate possible move requests, ie moves that effectively move at least one tooth,
// and which do not generate a broken tooth
function generatePossibleMoves() {
  let possibleMoves = [];
  [
    MOVE_REQUEST.LEFT,
    MOVE_REQUEST.RIGHT,
    MOVE_REQUEST.UP,
    MOVE_REQUEST.DOWN,
  ].forEach(function (aMoveRequest) {
    if (moveAllTeeth(aMoveRequest)) {
      // the move request moved at least one tooth,
      // we will add it in the list of possible moves only if it does not break a tooth
      if (!isOneToothBroken()) {
        possibleMoves.push(aMoveRequest);
      }
      undoLastMove();
    } else {
      // the move request did not move any tooth, no need to undo
    }
  });
  return possibleMoves;
}

// recursive solve,
function recursiveSolve() {
  solutionFound = false;
  numRecursiveCalls++;
  if (numRecursiveCalls % 1000 == 0) {
    console.log("num recursive calls: ", numRecursiveCalls);
  }
  if (isAllTeethSaved()) {
    solutionFound = true;
    solutions.push(sequenceOfMoves);
    strSolution = "";
    sequenceOfMoves.forEach(function (aMove) {
      strSolution += ",";
      strSolution += aMove;
    });
    console.log("solution found: (", sequenceOfMoves.length, "):", strSolution);
    console.log("num recursive calls: ", numRecursiveCalls);
  } else {
    // if we reached the maximum search depth, search no further
    if (sequenceOfMoves.length >= MAX_MOVES) {
      solutionFound = false;
    } else {
      // !! use "let" to force re-instanciation at each recursive call
      let possibleMoves = generatePossibleMoves();
      let i = 0;
      while (
        i < possibleMoves.length &&
        (solutionFound == false || !findAtMostOneSolution)
      ) {
        aMoveRequest = possibleMoves[i];
        sequenceOfMoves.push(aMoveRequest);
        if (DEBUG && 0) {
          console.log(
            "analyse:moves(",
            i + 1,
            "/",
            possibleMoves.length,
            ")=",
            sequenceOfMoves
          );
        }
        moveAllTeeth(aMoveRequest);
        if (recursiveSolve()) {
          solutionFound = true;
        }
        undoLastMove();
        sequenceOfMoves.pop();
        if (DEBUG && 0) {
          console.log("undo:   moves = ", sequenceOfMoves);
        }
        i++;
      }
    }
  }
  return solutionFound;
}

// initialise variables for solve, then call the recursive solve
function solve() {
  numRecursiveCalls = 0;
  solutions = []; // array of solutions. Each solution is a sequence of moves
  sequenceOfMoves = [];
  recursiveSolve();
}
