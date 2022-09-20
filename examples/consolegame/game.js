const blessed = require("blessed");

function makeBoard(boardSize, positions) {
  const [maxX, maxY] = boardSize;
  const board = new Array(maxX * maxY).fill(" ");
  positions.forEach((position, ix) => {
    board[position[0] + position[1] * maxY] = ix === 0 ? "O" : "X";
  });
  // add returns
  for (let i = 0; i < 39; i++) {
    const ix = (i + 1) * 40;
    const val = board[ix];
    board[ix] = `${val}\n`;
  }
  return board.join("");
}

function main() {
  // Create a screen object.
  const screen = blessed.screen({
    smartCSR: true,
  });

  screen.title = "Simple Hall Fight";

  let turn = 0;

  const w = Math.ceil((44 / screen.width) * 100);
  const h = Math.ceil((44 / screen.height) * 100);
  // console.log("w", w, "h", h, "width", screen.width, "height", screen.height);

  const player = [20, 30];
  const opponent = [20, 1];

  const emptyBoard = makeBoard([40, 40], [player, opponent]);

  // Create a box perfectly centered horizontally and vertically.
  const gameWrapper = blessed.box({
    top: "center",
    left: "center",
    width: "shrink",
    height: `${h}%`,
    border: {
      type: "line",
    },
    style: {
      fg: "white",
      bg: "black",
      border: {
        fg: "#f0f0f0",
      },
    },
  });

  const gameBox = blessed.box({
    top: "0",
    left: "0",
    width: "shrink",
    height: `${h}%`,
    content: emptyBoard,
    tags: true,
    style: {
      fg: "white",
      bg: "black",
      border: {
        fg: "#f0f0f0",
      },
    },
  });

  gameWrapper.append(gameBox);
  screen.append(gameWrapper);

  const statsBox = blessed.box({
    top: "0",
    left: gameBox.width + 1,
    width: "shrink",
    height: `${h}%`,
    content: makeStats(),
    tags: true,
    border: {
      type: "line",
    },
  });

  gameWrapper.append(statsBox);

  function makeStats() {
    const stats = [
      "   {bold}Stats{/}   ",
      "----------",
      `Turn: ${turn}`,
      `Player HP: 10`,
      `Opponent HP: 10`,
      "----------",
      "   Moves   ",
      "----------",
      "Arrow keys",
      "Q to quit",
    ];
    return stats.join("\n");
  }

  function advanceTurn() {
    turn += 1;
    const newBoard = makeBoard([40, 40], [player, opponent]);
    gameBox.setContent(newBoard);
    statsBox.setContent(makeStats());
    screen.render();
  }

  // Quit on Escape, q, or Control-C.
  screen.key(["escape", "q", "C-c"], function (ch, key) {
    return process.exit(0);
  });

  screen.key(["up", "down", "left", "right"], function (ch, key) {
    switch (key.name) {
      case "up":
        player[1] -= 1;
        break;
      case "down":
        player[1] += 1;
        break;
      case "left":
        player[0] -= 1;
        break;
      case "right":
        player[0] += 1;
        break;
    }
    advanceTurn();
  });

  // Focus our element.
  gameBox.focus();

  // Render the screen.
  screen.render();
}

main();
