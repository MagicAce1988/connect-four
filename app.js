document.addEventListener("DOMContentLoaded", () => {
  const squares = document.querySelectorAll(".grid div");
  const result = document.querySelector("#result");
  const displayCurrentPlayer = document.querySelector("#current-player");
  const error = document.querySelector(".error");
  const playerColor = document.querySelector(".player-color");
  const playerOneWins = [];
  const playerTwoWins = [];
  let currentPlayer = 1;
  let resetTimeout;
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
  let data = new Array(6).fill(1).map((e) => new Array(7));
  for (let index = 0; index < squares.length - 7; index++) {
    const ref = squares[index];
    var x = parseInt(index / 7);
    var y = index % 7;
    ref.setAttribute("x", x);
    ref.setAttribute("y", y);
    data[x][y] = new Cell(x, y, ref); //{ ref };
  }
  console.table(data);
  squares.forEach((square, index) => {
    square.addEventListener("click", () => {
      if (
        squares[index + 7].classList.contains("taken") &&
        !square.classList.contains("taken")
      ) {
        if (result.innerHTML.length < 1) {
          if (currentPlayer === 1) {
            playerOneWins.push(index);
            square.classList.add("taken");
            square.classList.add("player-one");
            playerColor.classList.remove("player-one");
            playerColor.classList.add("player-two");
            currentPlayer = 2;
            displayCurrentPlayer.innerHTML = currentPlayer;
            let x = Number(squares[index].getAttribute("x"));
            let y = Number(squares[index].getAttribute("y"));
            data[x][y].owner = "player-one";
            let vertical = [data[x][y]];
            let horizontal = [data[x][y]];
            let firstDiagonal = [data[x][y]];
            let secondDiagonal = [data[x][y]];

            let top = data[x][y].getDirection(
              [1, 0],
              data,
              "player-one",
              vertical
            );
            let bottom = data[x][y].getDirection(
              [-1, 0],
              data,
              "player-one",
              vertical
            );
            let left = data[x][y].getDirection(
              [0, 1],
              data,
              "player-one",
              horizontal
            );
            let right = data[x][y].getDirection(
              [0, -1],
              data,
              "player-one",
              horizontal
            );
            let topLeft = data[x][y].getDirection(
              [1, 1],
              data,
              "player-one",
              firstDiagonal
            );
            let bottomRight = data[x][y].getDirection(
              [-1, -1],
              data,
              "player-one",
              firstDiagonal
            );
            let topRight = data[x][y].getDirection(
              [1, -1],
              data,
              "player-one",
              secondDiagonal
            );
            let bottomLeft = data[x][y].getDirection(
              [-1, 1],
              data,
              "player-one",
              secondDiagonal
            );
            console.log(
              top + bottom + 1,
              left + right + 1,
              topLeft + bottomRight + 1,
              topRight + bottomLeft + 1
            );
            console.log(vertical, horizontal, firstDiagonal, secondDiagonal);
          } else if (currentPlayer === 2) {
            playerTwoWins.push(index);
            square.classList.add("taken");
            square.classList.add("player-two");
            playerColor.classList.remove("player-two");
            playerColor.classList.add("player-one");
            currentPlayer = 1;
            displayCurrentPlayer.innerHTML = currentPlayer;
            let x2 = Number(squares[index].getAttribute("x"));
            let y2 = Number(squares[index].getAttribute("y"));
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

  //   for (let y = 0; y < winningArrays.length; y++) {
  //     const square1 = squares[winningArrays[y][0]];
  //     const square2 = squares[winningArrays[y][1]];
  //     const square3 = squares[winningArrays[y][2]];
  //     const square4 = squares[winningArrays[y][3]];
  //     if (
  //       square1.classList.contains("player-one") &&
  //       square2.classList.contains("player-one") &&
  //       square3.classList.contains("player-one") &&
  //       square4.classList.contains("player-one")
  //     ) {
  //       error.style.display = "none";
  //       result.innerHTML = "Player one wins!";
  //       currentPlayer = 2;
  //       displayCurrentPlayer.innerHTML = currentPlayer;
  //       resetTimeout = setTimeout(() => {
  //         result.innerHTML = "";
  //         squares.forEach((square, index) => {
  //           resetTimeout = null;
  //           square.classList.remove("taken", "player-one", "player-two");
  //           if (index > squares.length - 8) {
  //             square.classList.add("taken");
  //           }
  //           error.style.display = "block";
  //         });
  //       }, 3000);
  //     } else if (
  //       square1.classList.contains("player-two") &&
  //       square2.classList.contains("player-two") &&
  //       square3.classList.contains("player-two") &&
  //       square4.classList.contains("player-two")
  //     ) {
  //       error.style.display = "none";
  //       result.innerHTML = "Player two wins!";
  //       currentPlayer = 1;
  //       displayCurrentPlayer.innerHTML = currentPlayer;
  //       resetTimeout = setTimeout(() => {
  //         resetTimeout = null;
  //         result.innerHTML = "";
  //         squares.forEach((square, index) => {
  //           square.classList.remove("taken", "player-one", "player-two");
  //           if (index > squares.length - 8{
  //             square.classList.add("taken");
  //           }
  //           error.style.display = "block";
  //         });
  //       }, 3000);
  //     }
  //   }
  // }
  // squares.forEach((square) => square.addEventListener("click", checkBoard));
});
