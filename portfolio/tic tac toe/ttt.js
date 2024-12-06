let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let userTurn = true; // Player 'X' (user)
let count = 0; // To Track Draw

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  userTurn = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (userTurn && box.innerText === "") {
      box.innerText = "X";
      userTurn = false;
      box.disabled = true;
      count++;

      if (!checkWinner() && count < 9) {
        setTimeout(computerMove, 500);
      }

      if (count === 9 && !checkWinner()) {
        gameDraw();
      }
    }
  });
});

const computerMove = () => {
  let availableBoxes = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      availableBoxes.push(index);
    }
  });

  if (availableBoxes.length > 0) {
    let randomIndex = Math.floor(Math.random() * availableBoxes.length);
    boxes[availableBoxes[randomIndex]].innerText = "O";
    boxes[availableBoxes[randomIndex]].disabled = true;
    userTurn = true;
    count++;

    if (count === 9 && !checkWinner()) {
      gameDraw();
    }
  }
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
  return false;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
