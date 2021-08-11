"use strict";

//will need to set "state" that the function is in at present time

//animation for selection

// button for confirmation

// the top menu will need to have a minimum width, goes from that width up to width of screen.
//Mobile should probably be width of screen in portrait and maybe landscape
//animation will only clear the area around the animated line. This may get complicated, is it better just to redraw everything? Probably yes

//generate closure for global variables
//redo vars to let and const
//triple equals also

var isPlayer1sTurn = true;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var diamondSize = 4;
var squareCount = 0;
var clickTolerance = 6;
let confirmedLines = [];
let currentLineSelection = [];
let boardRows = 2;
let boardColumns = 2;
var gridSpacing = 36;
let player1Boxes = [];
let player2Boxes = [];
var player1Score = 0;
var player2Score = 0;
var topBorder = 36;
var rightBorder = 564;
var bottomBorder = 764;
var leftBorder = 36;
var player1Color = "#ff0000";
var player2Color = "#ffa500";
let player1Name = "Player 1";
let player2Name = "Player 2";
var activePlayerColor = player1Color;
let clickActive = true;

canvas.addEventListener("mousedown", doMouseDown, false);

let colorBoxes = document.querySelectorAll(".color-box");

colorBoxes.forEach((colorBox) => {
  colorBox.addEventListener("click", setPlayerColors);
});

function setPlayerColors() {
  if (!this.classList.contains("crossed-out-color")) {
    const colorBoxes = this.parentElement.querySelectorAll(".color-box");

    colorBoxes.forEach((colorBox) => {
      if (colorBox.classList.contains("color-box-selected")) {
        colorBox.classList.toggle("color-box-selected");
      }
    });

    if (this.parentElement.id === "player-1-color-selection") {
      let player2ColorSelections = document.querySelector(
        "#player-2-color-selection"
      );

      player2ColorSelections
        .querySelector(".crossed-out-color")
        .classList.toggle("crossed-out-color");
      player2ColorSelections
        .querySelector(`.${this.classList[0]}`)
        .classList.toggle("crossed-out-color");
    } else {
      let player1ColorSelections = document.querySelector(
        "#player-1-color-selection"
      );

      player1ColorSelections
        .querySelector(".crossed-out-color")
        .classList.toggle("crossed-out-color");

      player1ColorSelections
        .querySelector(`.${this.classList[0]}`)
        .classList.toggle("crossed-out-color");
    }

    this.classList.toggle("color-box-selected");

    let color = window.getComputedStyle(this).backgroundColor;
    if (this.parentElement.id === "player-1-color-selection") {
      player1Color = color;
    } else {
      player2Color = color;
    }
  }
}

var currentScreen = document.getElementById("start-screen");

function fadeInLine(x, y) {
  let redraw = setInterval(() => {
    drawGrid();
  });
}

function printOutLines() {
  confirmedLines.forEach((element) => {
    console.log(element[0] + ", " + element[1] + "\n");
  });
}

function isLineClicked(x, y) {
  var lineClicked = false;

  confirmedLines.forEach((line) => {
    if (line[0] == x) {
      if (line[1] == y) {
        lineClicked = true;
      }
    }
  });

  return lineClicked;
}

function changePlayerTurn() {
  if (isPlayer1sTurn) {
    document.getElementById("turn-display").innerHTML = `${player2Name}'s Turn`;
    activePlayerColor = player2Color;
    isPlayer1sTurn = false;
  } else {
    document.getElementById("turn-display").innerHTML = `${player1Name}'s Turn`;
    activePlayerColor = player1Color;
    isPlayer1sTurn = true;
  }
}

function findCenterOfLine(x, y, isVertical) {
  var gridX = 0;
  var gridY = 0;
  if (isVertical) {
    if (x % gridSpacing == 0) {
      gridX = x;
    } else if (x % gridSpacing <= clickTolerance && x > gridSpacing) {
      gridX = x - (x % gridSpacing);
    } else {
      gridX = x + clickTolerance - ((x + clickTolerance) % gridSpacing);
    }

    gridY = y - (y % gridSpacing) + gridSpacing / 2;
  } else {
    if (y % gridSpacing == 0) {
      gridY = y;
    } else if (y % gridSpacing < clickTolerance && y > gridSpacing) {
      gridY = y - (y % gridSpacing);
    } else {
      gridY = y + clickTolerance - ((y + clickTolerance) % gridSpacing);
    }

    gridX = x - (x % gridSpacing) + gridSpacing / 2;
  }

  return [gridX, gridY];
}

function checkSquareOutline(x, y) {
  let line1 = [];
  let line2 = [];
  let line3 = [];
  let line4 = [];

  var line1Exists = false;
  var line2Exists = false;
  var line3Exists = false;
  var line4Exists = false;
  var breakpoint = false;

  line1.push(x);
  line1.push(y - gridSpacing / 2);

  line2.push(x + gridSpacing / 2);
  line2.push(y);

  line3.push(x);
  line3.push(y + gridSpacing / 2);

  line4.push(x - gridSpacing / 2);
  line4.push(y);

  for (let i = 0; i < confirmedLines.length; i++) {
    let line = [];
    line = confirmedLines[i];

    if (line[0] == line1[0]) {
      if (line[1] == line1[1]) {
        line1Exists = true;

        i = confirmedLines.length;
      }
    }
  }

  if (line1Exists) {
    for (let i = 0; i < confirmedLines.length; i++) {
      let line = [];
      line = confirmedLines[i];

      if (line[0] == line2[0]) {
        if (line[1] == line2[1]) {
          line2Exists = true;

          i = confirmedLines.length;
        }
      }
    }

    if (line2Exists) {
      for (let i = 0; i < confirmedLines.length; i++) {
        let line = [];
        line = confirmedLines[i];

        if (line[0] == line3[0]) {
          if (line[1] == line3[1]) {
            line3Exists = true;

            i = confirmedLines.length;
          }
        }
      }
    }

    if (line3Exists) {
      for (let i = 0; i < confirmedLines.length; i++) {
        let line = [];
        line = confirmedLines[i];

        if (line[0] == line4[0]) {
          if (line[1] == line4[1]) {
            line4Exists = true;

            i = confirmedLines.length;
          }
        }
      }
      // console.log("Line 1: " + line1[0] + ", " + line1[1] + " Exists?:" + line1Exists + "\n" + "Line 2: " + line2[0] + ", " + line2[1] + " Exists?:" + line2Exists + "\n" + "Line 3: " + line3[0] +  ", " + line3[1] + " Exists?:" + line3Exists + "\n" + "Line 4: " + line4[0] + ", " + line4[1] + " Exists?:" + line4Exists);
    }

    if (line4Exists) {
      return true;
    }
  }
}

function increaseScore(x, y) {
  var currentScore;
  let boxCoordinates = [];
  boxCoordinates.push(x);
  boxCoordinates.push(y);
  if (isPlayer1sTurn) {
    currentScore = parseInt(document.getElementById("player1-score").innerHTML);
    currentScore += 1;
    document.getElementById("player1-score").innerHTML = currentScore;
    player1Boxes.push(boxCoordinates);
  } else {
    currentScore = parseInt(document.getElementById("player2-score").innerHTML);
    currentScore += 1;
    document.getElementById("player2-score").innerHTML = currentScore;
    player2Boxes.push(boxCoordinates);
  }
}

function checkSquares(x, y) {
  // vertical line
  let square1Coord = [];
  let square2Coord = [];

  var boxCompleted = false;

  if (x % gridSpacing == 0) {
    if (x - gridSpacing / 2 > leftBorder) {
      square1Coord.push(x - gridSpacing / 2);
      square1Coord.push(y);
    }

    if (x + gridSpacing / 2 < rightBorder) {
      square2Coord.push(x + gridSpacing / 2);
      square2Coord.push(y);
    }
  }
  //horizontal line
  else {
    if (y - gridSpacing / 2 > topBorder) {
      square1Coord.push(x);
      square1Coord.push(y - gridSpacing / 2);
    }

    if (y + gridSpacing / 2 < bottomBorder) {
      square2Coord.push(x);
      square2Coord.push(y + gridSpacing / 2);
    }
  }
  if (square1Coord[0] != null) {
    if (checkSquareOutline(square1Coord[0], square1Coord[1])) {
      drawSquare(square1Coord[0], square1Coord[1]);
      boxCompleted = true;
      increaseScore(square1Coord[0], square1Coord[1]);
    }
  }

  if (square2Coord[0] != null) {
    if (checkSquareOutline(square2Coord[0], square2Coord[1])) {
      drawSquare(square2Coord[0], square2Coord[1]);
      boxCompleted = true;
      increaseScore(square1Coord[0], square1Coord[1]);
    }
  }

  if (player1Boxes.length + player2Boxes.length == squareCount) {
    endGame();
  }

  return boxCompleted;
}

function drawSquare(x, y) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var square = new Path2D();
  square.rect(x - 14, y - 14, 28, 28);
  ctx.fillStyle = activePlayerColor;
  ctx.fill(square);
}

function drawVerticalLine(x, y) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var verticalLine = new Path2D();

  verticalLine.moveTo(x, y - gridSpacing / 2 - diamondSize);
  verticalLine.lineTo(x + diamondSize, y - gridSpacing / 2);
  verticalLine.lineTo(x + diamondSize, y + gridSpacing / 2);
  verticalLine.lineTo(x, y + gridSpacing / 2 + diamondSize);
  verticalLine.lineTo(x - diamondSize, y + gridSpacing / 2);
  verticalLine.lineTo(x - diamondSize, y - gridSpacing / 2);

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fill(verticalLine);
}

function drawHorizontalLine(x, y) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var horizontalLine = new Path2D();

  horizontalLine.moveTo(x - gridSpacing / 2 - diamondSize, y);
  horizontalLine.lineTo(x - gridSpacing / 2, y - diamondSize);
  horizontalLine.lineTo(x + gridSpacing / 2, y - diamondSize);
  horizontalLine.lineTo(x + gridSpacing / 2 + diamondSize, y);
  horizontalLine.lineTo(x + gridSpacing / 2, y + diamondSize);
  horizontalLine.lineTo(x - gridSpacing / 2, y + diamondSize);

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fill(horizontalLine);
}

function doMouseDown(e) {
  if (clickActive) {
    let rect = canvas.getBoundingClientRect();
    // var canvas_x = e.clientX - canvas.offsetLeft;
    // var canvas_y = e.clientY - canvas.offsetTop;

    var canvas_x = e.clientX - rect.left;
    var canvas_y = e.clientY - rect.top;

    // var canvas_x = e.pageX;
    // var canvas_y = e.pageY;

    var clickXOnGrid = false;
    var clickYOnGrid = false;
    var lineIsClicked = false;
    // horizontal check
    var boxCompleted = false;

    if (
      canvas_x % gridSpacing <= clickTolerance ||
      canvas_x % gridSpacing >= gridSpacing - clickTolerance
    ) {
      clickXOnGrid = true;
    }
    if (
      canvas_y % gridSpacing <= clickTolerance ||
      canvas_y % gridSpacing >= gridSpacing - clickTolerance
    ) {
      clickYOnGrid = true;
    }

    if (
      !lineIsClicked &&
      clickXOnGrid &&
      !clickYOnGrid &&
      canvas_y >= gridSpacing - clickTolerance
    ) {
      var lineCenter = findCenterOfLine(canvas_x, canvas_y, true);

      if (!isLineClicked(lineCenter[0], lineCenter[1])) {
        drawVerticalLine(lineCenter[0], lineCenter[1]);
        confirmedLines.push(lineCenter);
        boxCompleted = checkSquares(lineCenter[0], lineCenter[1]);

        // printOutLines();

        if (!boxCompleted) {
          changePlayerTurn();
        }
      }
    }
  }

  if (
    !lineIsClicked &&
    clickYOnGrid &&
    !clickXOnGrid &&
    canvas_x >= gridSpacing - clickTolerance
  ) {
    var lineCenter = findCenterOfLine(canvas_x, canvas_y, false);

    if (!isLineClicked(lineCenter[0], lineCenter[1])) {
      drawHorizontalLine(lineCenter[0], lineCenter[1]);
      confirmedLines.push(lineCenter);
      boxCompleted = checkSquares(lineCenter[0], lineCenter[1]);

      // printOutLines();

      if (!boxCompleted) {
        changePlayerTurn();
      }
    }
  }
}

function drawGridDiamond(x, y, size) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var diamond = new Path2D();

  diamond.moveTo(x, y - size);
  diamond.lineTo(x + size, y);
  diamond.lineTo(x, y + size);
  diamond.lineTo(x - size, y);
  ctx.fillStyle = "rgba(160,160,160,1)";
  ctx.fill(diamond);
}

function drawGrid() {
  var i;

  for (i = gridSpacing; i < canvas.height; i += gridSpacing) {
    var j;
    for (j = gridSpacing; j < canvas.width; j += gridSpacing) {
      drawGridDiamond(j, i, diamondSize);
    }
  }
}

function endGame() {
  if (player1Boxes.length > player2Boxes.length) {
    document.getElementById("turn-display").innerHTML = `${player1Name} Wins`;
  } else if (player2Boxes.length > player1Boxes.length) {
    document.getElementById("turn-display").innerHTML = `${player1Name} Wins`;
  } else {
    document.getElementById("turn-display").innerHTML = "Tie!";
  }
}

function changeTextScreen(viewID, duration) {
  var newScreen = document.getElementById(viewID);

  newScreen.style.display = "flex";

  currentScreen.style.opacity = 0;

  setTimeout(() => {
    currentScreen.style.display = "none";
    newScreen.style.opacity = 1;
    currentScreen = newScreen;
  }, duration);
}

function startGame() {
  player1Name = document.getElementById("player-1-name-field").value;
  player2Name = document.getElementById("player-2-name-field").value;

  let widthSelection = document.getElementById("width-selection");
  boardColumns = parseInt(
    widthSelection.options[widthSelection.selectedIndex].text
  );
  let heightSelection = document.getElementById("height-selection");
  boardRows = parseInt(
    heightSelection.options[heightSelection.selectedIndex].text
  );

  squareCount = boardColumns * boardRows;

  //set player names

  document.getElementById("player-1-name").innerHTML = player1Name;
  document.getElementById("player-2-name").innerHTML = player2Name;

  canvas.width = (boardColumns + 2) * gridSpacing;
  canvas.height = (boardRows + 2) * gridSpacing;
  drawGrid();
  currentScreen.style.opacity = 0;
  setTimeout(() => {
    currentScreen.style.display = "none";
    document.getElementById("text-container").style.display = "none";
    canvas.style.opacity = 1;
  }, 750);
}

squareCount =
  (Math.floor(canvas.width / gridSpacing) - 1) *
  (Math.floor(canvas.height / gridSpacing) - 1);

console.log("Square Count: " + squareCount);
// drawGrid();
