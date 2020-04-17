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
    getDirection(dir, grid, owner) {
      let next = (grid[this.x + dir[0]] || [])[this.y + dir[1]];
      if (!next || owner !== next.owner) return 0;
      return 1 + next.getDirection(dir, grid, owner);
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
            let top = data[x][y].getDirection([1, 0], data, "player-one");
            let bottom = data[x][y].getDirection([-1, 0], data, "player-one");
            let left = data[x][y].getDirection([0, 1], data, "player-one");
            let right = data[x][y].getDirection([0, -1], data, "player-one");
            let topLeft = data[x][y].getDirection([1, 1], data, "player-one");
            let bottomRight = data[x][y].getDirection(
              [-1, -1],
              data,
              "player-one"
            );
            let topRight = data[x][y].getDirection([1, -1], data, "player-one");
            let bottomLeft = data[x][y].getDirection(
              [-1, 1],
              data,
              "player-one"
            );
            console.log(
              top + bottom + 1,
              left + right + 1,
              topLeft + bottomRight + 1,
              topRight + bottomLeft + 1
            );
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
  // function checkBoard() {
  //   if (resetTimeout) return;
  //   const winningArrays = [
  //     [0, 1, 2, 3],
  //     [41, 40, 39, 38],
  //     [7, 8, 9, 10],
  //     [34, 33, 32, 31],
  //     [14, 15, 16, 17],
  //     [27, 26, 25, 24],
  //     [21, 22, 23, 24],
  //     [20, 19, 18, 17],
  //     [28, 29, 30, 31],
  //     [13, 12, 11, 10],
  //     [35, 36, 37, 38],
  //     [6, 5, 4, 3],
  //     [0, 7, 14, 21],
  //     [41, 34, 27, 20],
  //     [1, 8, 15, 22],
  //     [40, 33, 26, 19],
  //     [2, 9, 16, 23],
  //     [39, 32, 25, 18],
  //     [3, 10, 17, 24],
  //     [38, 31, 24, 17],
  //     [4, 11, 18, 25],
  //     [37, 30, 23, 16],
  //     [5, 12, 19, 26],
  //     [36, 29, 22, 15],
  //     [6, 13, 20, 27],
  //     [35, 28, 21, 14],
  //     [0, 8, 16, 24],
  //     [41, 33, 25, 17],
  //     [7, 15, 23, 31],
  //     [34, 26, 18, 10],
  //     [14, 22, 30, 38],
  //     [27, 19, 11, 3],
  //     [35, 29, 23, 17],
  //     [6, 12, 18, 24],
  //     [28, 22, 16, 10],
  //     [13, 19, 25, 31],
  //     [21, 15, 9, 3],
  //     [20, 26, 32, 38],
  //     [36, 30, 24, 18],
  //     [5, 11, 17, 23],
  //     [37, 31, 25, 19],
  //     [4, 10, 16, 22],
  //     [2, 10, 18, 26],
  //     [39, 31, 23, 15],
  //     [1, 9, 17, 25],
  //     [40, 32, 24, 16],
  //     [9, 7, 25, 33],
  //     [8, 16, 24, 32],
  //     [11, 7, 23, 29],
  //     [12, 18, 24, 30],
  //     [1, 2, 3, 4],
  //     [5, 4, 3, 2],
  //     [8, 9, 10, 11],
  //     [12, 11, 10, 9],
  //     [15, 16, 17, 18],
  //     [19, 18, 17, 16],
  //     [22, 23, 24, 25],
  //     [26, 25, 24, 23],
  //     [29, 30, 31, 32],
  //     [33, 32, 31, 30],
  //     [36, 37, 38, 39],
  //     [40, 39, 38, 37],
  //     [7, 14, 21, 28],
  //     [8, 15, 22, 29],
  //     [9, 16, 23, 30],
  //     [10, 17, 24, 31],
  //     [11, 18, 25, 32],
  //     [12, 19, 26, 33],
  //     [13, 20, 27, 34],
  //   ];
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
