document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const result = document.querySelector("#result");
  const displayCurrentPlayer = document.querySelector("#current-player");
  const error = document.querySelector(".error");
  const playerColor = document.querySelector(".player-color");
  const submit = document.querySelector(".submit");
  const alert = document.querySelector(".alert");
  let heightValue, widthValue, squares, data, animateInterval;
  let currentPlayer = 1;

  const directions = {
    top: [1, 0, "vertical"],
    bottom: [-1, 0, "vertical"],
    left: [0, 1, "horizontal"],
    right: [0, -1, "horizontal"],
    topLeft: [1, 1, "firstDiagonal"],
    bottomRight: [-1, -1, "firstDiagonal"],
    topRight: [1, -1, "secondDiagonal"],
    bottomLeft: [-1, 1, "secondDiagonal"],
  };

  class Cell {
    constructor(x, y, ref) {
      this.ref = ref;
      this.x = x;
      this.y = y;
      this.owner = null;
    }
    getDirection(direction, grid, owner, all) {
      const dir = directions[direction];
      let next = (grid[this.x + dir[0]] || [])[this.y + dir[1]];
      if (!next || owner !== next.owner) return 0;
      all.push(next);
      return 1 + next.getDirection(direction, grid, owner, all);
    }
  }

  const animateWin = (winSet) => {
    animateInterval = setInterval(() => {
      winSet.forEach((win) => {
        win.ref.style.opacity = 0.4;
        setTimeout(() => {
          win.ref.style.opacity = 1;
        }, 500);
      });
    }, 1000);
  };

  const checkWin = (index, player) => {
    const displayWin = (
      verticalSum,
      horizontalSum,
      firstDiagonalSum,
      secondDiagonalSum,
      player
    ) => {
      let winDirection;

      switch (true) {
        case verticalSum === 4:
          winDirection = vertical;
          break;
        case horizontalSum === 4:
          winDirection = horizontal;
          break;
        case firstDiagonalSum === 4:
          winDirection = firstDiagonal;
          break;
        case secondDiagonalSum === 4:
          winDirection = secondDiagonal;
          break;
        default:
          winDirection = [];
      }

      if (winDirection.length > 0) {
        result.innerHTML = player === 1 ? "Player One Wins" : "Player Two wins";
        error.style.display = "none";
        animateWin(winDirection);
      }
    };

    let passedPlayer = player === 1 ? "player-one" : "player-two";
    let x = Number(squares[index].getAttribute("x"));
    let y = Number(squares[index].getAttribute("y"));
    data[x][y].owner = passedPlayer;
    let all = {
      vertical: [data[x][y]],
      horizontal: [data[x][y]],
      firstDiagonal: [data[x][y]],
      secondDiagonal: [data[x][y]],
    };

    let directionSums = {};

    const calculateDirectionSums = (data, passedPlayer, x, y) => {
      const allDirectionsKeys = Object.keys(directions);
      const allDirectionsValues = Object.values(directions);
      allDirectionsKeys.forEach((element, i) => {
        directionSums[element] = data[x][y].getDirection(
          element,
          data,
          passedPlayer,
          all[allDirectionsValues[i][2]]
        );
      });
    };

    calculateDirectionSums(data, passedPlayer, x, y);

    let {
      top,
      bottom,
      left,
      right,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    } = directionSums;

    let { vertical, horizontal, firstDiagonal, secondDiagonal } = all;

    displayWin(
      top + bottom + 1,
      left + right + 1,
      topLeft + bottomRight + 1,
      topRight + bottomLeft + 1,
      player
    );
  };

  const runGame = (gridWidth, gridHeight) => {
    clearInterval(animateInterval);
    currentPlayer = 1;
    squares = document.querySelectorAll(".grid div");
    data = new Array(gridHeight).fill(1).map((e) => new Array(gridWidth));
    for (let index = 0; index < squares.length - gridWidth; index++) {
      const ref = squares[index];
      let x = parseInt(index / gridWidth);
      let y = index % gridWidth;
      ref.setAttribute("x", x);
      ref.setAttribute("y", y);
      data[x][y] = new Cell(x, y, ref); //{ ref };
    }

    squares.forEach((square, index) => {
      square.addEventListener("click", () => {
        if (
          squares[index + gridWidth].classList.contains("taken") &&
          !square.classList.contains("taken")
        ) {
          if (result.innerHTML.length < 1) {
            if (currentPlayer === 1) {
              square.classList.add("taken");
              square.classList.add("player-one");
              playerColor.classList.remove("player-one");
              playerColor.classList.add("player-two");
              checkWin(index, currentPlayer);
              currentPlayer = 2;
              displayCurrentPlayer.innerHTML = currentPlayer;
            } else if (currentPlayer === 2) {
              square.classList.add("taken");
              square.classList.add("player-two");
              playerColor.classList.remove("player-two");
              playerColor.classList.add("player-one");
              checkWin(index, currentPlayer);
              currentPlayer = 1;
              displayCurrentPlayer.innerHTML = currentPlayer;
            }
          }
        } else {
          if (result.innerHTML.length < 1) {
            error.textContent = `You can't go there!`;
            setTimeout(() => {
              error.textContent = "";
            }, 1000);
          }
        }
      });
    });
  };

  submit.addEventListener("click", () => {
    result.innerHTML = "";
    const height = document.querySelector(".height");
    const width = document.querySelector(".width");
    if (Number(height.value) < 4 || Number(width.value) < 4) {
      height.value = null;
      width.value = null;
      alert.style.height = "36px";
      alert.style.padding = "8px";
    } else {
      alert.style.height = "0";
      alert.style.padding = "0";
      heightValue = Number(height.value);
      widthValue = Number(width.value);
      height.value = null;
      width.value = null;

      while (grid.firstChild && grid.removeChild(grid.firstChild));
      grid.style.height =
        heightValue > 10 || widthValue > 10
          ? heightValue > 20 || widthValue > 20
            ? `${heightValue * 10}px`
            : `${heightValue * 20}px`
          : `${heightValue * 40}px`;
      grid.style.width =
        heightValue > 10 || widthValue > 10
          ? heightValue > 20 || widthValue > 20
            ? `${widthValue * 10}px`
            : `${widthValue * 20}px`
          : `${widthValue * 40}px`;
      for (i = 0; i < heightValue * widthValue; i++) {
        let div = document.createElement("div");
        div.classList.add(
          heightValue > 10 || widthValue > 10
            ? heightValue > 20 || widthValue > 20
              ? "verySmallCell"
              : "smallCell"
            : "cell"
        );
        grid.appendChild(div);
      }
      for (i = 0; i < widthValue; i++) {
        let div = document.createElement("div");
        div.classList.add("taken");
        div.classList.add(
          heightValue > 10 || widthValue > 10
            ? heightValue > 20 || widthValue > 20
              ? "verySmallCell"
              : "smallCell"
            : "cell"
        );
        grid.appendChild(div);
      }

      runGame(widthValue, heightValue);
    }
  });
  runGame(7, 7);
});
