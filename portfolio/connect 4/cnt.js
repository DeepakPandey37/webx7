// Initial references
const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");

let initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
let currentPlayer;

// Random Number Between Range
const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

// Loop through array and check for same values
const verifyArray = (arrayElement) => {
  let bool = false;
  let elementCount = 0;
  arrayElement.forEach((element, index) => {
    if (element == currentPlayer) {
      elementCount += 1;
      if (elementCount == 4) {
        bool = true;
      }
    } else {
      elementCount = 0;
    }
  });
  return bool;
};

// Check for game over (Last step)
const gameOverCheck = () => {
  let truthCounnt = 0;
  for (let innerArray of initialMatrix) {
    if (innerArray.every((val) => val != 0)) {
      truthCounnt += 1;
    } else {
      return false;
    }
  }
  if (truthCounnt == 6) {
    message.innerText = "Game Over";
    startScreen.classList.remove("hide");
  }
};

// Check rows
const checkAdjacentRowValues = (row) => {
  return verifyArray(initialMatrix[row]);
};

// Check columns
const checkAdjacentColumnValues = (column) => {
  let colWinCount = 0,
    colWinBool = false;
  initialMatrix.forEach((element, index) => {
    if (element[column] == currentPlayer) {
      colWinCount += 1;
      if (colWinCount == 4) {
        colWinBool = true;
      }
    } else {
      colWinCount = 0;
    }
  });
  // no match
  return colWinBool;
};

// Get Right diagonal values
const getRightDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let rightDiagonal = [];
  while (rowCount > 0) {
    if (columnCount >= columnLength - 1) {
      break;
    }
    rowCount -= 1;
    columnCount += 1;
    rightDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount < 0) {
      break;
    }
    rightDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount -= 1;
  }
  return rightDiagonal;
};

// Get Left diagonal values
const getLeftDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let leftDiagonal = [];
  while (rowCount > 0) {
    if (columnCount <= 0) {
      break;
    }
    rowCount -= 1;
    columnCount -= 1;
    leftDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount >= columnLength) {
      break;
    }
    leftDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount += 1;
  }
  return leftDiagonal;
};

// Check diagonal
const checkAdjacentDiagonalValues = (row, column) => {
  let diagWinBool = false;
  let tempChecks = {
    leftTop: [],
    rightTop: [],
  };
  let columnLength = initialMatrix[row].length;
  let rowLength = initialMatrix.length;

  // Store left and right diagonal array
  tempChecks.leftTop = [
    ...getLeftDiagonal(row, column, rowLength, columnLength),
  ];

  tempChecks.rightTop = [
    ...getRightDiagonal(row, column, rowLength, columnLength),
  ];
  // check both arrays for similarities
  diagWinBool = verifyArray(tempChecks.rightTop);
  if (!diagWinBool) {
    diagWinBool = verifyArray(tempChecks.leftTop);
  }
  return diagWinBool;
};

// Win check logic
const winCheck = (row, column) => {
  // if any of the functions return true we return true
  return checkAdjacentRowValues(row)
    ? true
    : checkAdjacentColumnValues(column)
    ? true
    : checkAdjacentDiagonalValues(row, column)
    ? true
    : false;
};

// Sets the circle to exact points
const setPiece = (startCount, colValue) => {
  let rows = document.querySelectorAll(".grid-row");
  // Initially it will place the circles in the last row else if no place available we will decrement the count until we find empty slot
  if (initialMatrix[startCount][colValue] != 0) {
    startCount -= 1;
    setPiece(startCount, colValue);
  } else {
    // place circle
    let currentRow = rows[startCount].querySelectorAll(".grid-box");
    currentRow[colValue].classList.add("filled", `player${currentPlayer}`);
    // Update Matrix
    initialMatrix[startCount][colValue] = currentPlayer;
    // Check for wins
    if (winCheck(startCount, colValue)) {
      message.innerHTML = `Player<span> ${currentPlayer}</span> wins`;
      startScreen.classList.remove("hide");
      return false;
    }
  }
  // Check if all are full
  gameOverCheck();
};

// Computer move logic
const computerMove = () => {
  // Check if the computer can win in the next move
  for (let col = 0; col < 7; col++) {
    for (let row = 5; row >= 0; row--) {
      if (initialMatrix[row][col] === 0) {
        initialMatrix[row][col] = 2; // Simulate computer move
        if (winCheck(row, col)) {
          initialMatrix[row][col] = 0; // Revert simulation
          setPiece(row, col); // Make winning move
          currentPlayer = 1;
          playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
          return;
        }
        initialMatrix[row][col] = 0; // Revert simulation
        break;
      }
    }
  }

  // Check if the player can win in the next move and block it
  for (let col = 0; col < 7; col++) {
    for (let row = 5; row >= 0; row--) {
      if (initialMatrix[row][col] === 0) {
        initialMatrix[row][col] = 1; // Simulate player move
        if (winCheck(row, col)) {
          initialMatrix[row][col] = 0; // Revert simulation
          setPiece(row, col); // Make blocking move
          currentPlayer = 1;
          playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
          return;
        }
        initialMatrix[row][col] = 0; // Revert simulation
        break;
      }
    }
  }

  // Look for strategic moves
  const strategicMove = findStrategicMove();
  if (strategicMove) {
    const [row, col] = strategicMove;
    setPiece(row, col);
    currentPlayer = 1;
    playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
    return;
  }

  // If neither can win, make a random move
  let colValue;
  do {
    colValue = generateRandomNumber(0, 7);
  } while (initialMatrix[0][colValue] !== 0);

  setPiece(5, colValue);
  currentPlayer = 1;
  playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
};

// Find strategic moves to create opportunities
const findStrategicMove = () => {
  for (let col = 0; col < 7; col++) {
    for (let row = 5; row >= 0; row--) {
      if (initialMatrix[row][col] === 0) {
        initialMatrix[row][col] = 2; // Simulate computer move
        if (
          checkAdjacentRowValues(row) ||
          checkAdjacentColumnValues(col) ||
          checkAdjacentDiagonalValues(row, col)
        ) {
          initialMatrix[row][col] = 0; // Revert simulation
          return [row, col]; // Return strategic move
        }
        initialMatrix[row][col] = 0; // Revert simulation
        break;
      }
    }
  }
  return null;
};

// Player move
const fillBox = (event) => {
  let colValue = Number(event.target.getAttribute("data-value"));
  if (currentPlayer === 1) {
    setPiece(5, colValue);
    currentPlayer = 2;
    playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
    setTimeout(computerMove, 500); // Computer's turn after player
  }
};

// Create the grid
const matrixCreator = () => {
  initialMatrix.forEach((element, index) => {
    let div = document.createElement("div");
    div.setAttribute("class", "grid-row");
    element.forEach((subElement, subIndex) => {
      let childDiv = document.createElement("div");
      childDiv.setAttribute("class", "grid-box");
      childDiv.setAttribute("data-value", subIndex);
      childDiv.addEventListener("click", fillBox);
      div.appendChild(childDiv);
    });
    container.appendChild(div);
  });
};

// Initialize game
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  container.innerHTML = "";
  initialMatrix = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  matrixCreator();
  currentPlayer = generateRandomNumber(1, 3);
  playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
  if (currentPlayer === 2) {
    setTimeout(computerMove, 500); // Computer starts if it is player 2
  }
});
