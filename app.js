document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const result = document.querySelector("#result");
  const displayCurrentPlayer = document.querySelector("#current-player");
  const error = document.querySelector(".error");
  const playerColor = document.querySelector(".player-color");
  let currentPlayer = 1;
  const submit = document.querySelector(".submit");
  let heightValue, widthValue, squares, data;

  class Cell {
    constructor(x, y, ref) {
      this.ref = ref;
      this.x = x;
      this.y = y;
      this.owner = null;
    }
    getDirection(dir, grid, owner, all) {
      let next = (grid[this.x + dir[0]] || [])[this.y + dir[1]];
      if (!next || owner !== next.owner) return 0;
      all.push(next);
      return 1 + next.getDirection(dir, grid, owner, all);
    }
  }

  const runGame = (gridWidth, gridHeight) => {
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

  const checkWin = (index, player) => {
    console.log(index);
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
          winDirection = vertical;
          break;
        case firstDiagonalSum === 4:
          winDirection = vertical;
          break;
        case secondDiagonalSum === 4:
          winDirection = vertical;
          break;
        default:
          winDirection = [];
      }

      if (winDirection.length > 0) {
        result.innerHTML = player === 1 ? "Player One Wins" : "Player Two wins";
        error.style.display = "none";
      }
    };

    let passedPlayer = player === 1 ? "player-one" : "player-two";
    let x = Number(squares[index].getAttribute("x"));
    let y = Number(squares[index].getAttribute("y"));
    data[x][y].owner = passedPlayer;
    let vertical = [data[x][y]];
    let horizontal = [data[x][y]];
    let firstDiagonal = [data[x][y]];
    let secondDiagonal = [data[x][y]];

    let top = data[x][y].getDirection([1, 0], data, passedPlayer, vertical);
    let bottom = data[x][y].getDirection([-1, 0], data, passedPlayer, vertical);
    let left = data[x][y].getDirection([0, 1], data, passedPlayer, horizontal);
    let right = data[x][y].getDirection(
      [0, -1],
      data,
      passedPlayer,
      horizontal
    );
    let topLeft = data[x][y].getDirection(
      [1, 1],
      data,
      passedPlayer,
      firstDiagonal
    );
    let bottomRight = data[x][y].getDirection(
      [-1, -1],
      data,
      passedPlayer,
      firstDiagonal
    );
    let topRight = data[x][y].getDirection(
      [1, -1],
      data,
      passedPlayer,
      secondDiagonal
    );
    let bottomLeft = data[x][y].getDirection(
      [-1, 1],
      data,
      passedPlayer,
      secondDiagonal
    );
    displayWin(
      top + bottom + 1,
      left + right + 1,
      topLeft + bottomRight + 1,
      topRight + bottomLeft + 1,
      player
    );
  };

  submit.addEventListener("click", () => {
    result.innerHTML = "";
    const height = document.querySelector(".height");
    const width = document.querySelector(".width");
    heightValue = Number(height.value) || 7;
    widthValue = Number(width.value) || 7;
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
  });
  runGame(7, 6);
});
