const chai = require("chai");
const path = require("path");
const tester = require("circom_tester").wasm;

const assert = chai.assert;

const DEFAULT_PARAMS = {
  nonce: 1,
  board: 10010,
  positions: [4001, 8009],
  hp: [20, 10],
};

const CARDINALS = {
  NORTH:  1,
  EAST:   2,
  SOUTH:  3,
  WEST:   4,
};

async function getCircuit(name) {
  const circuitFile = path.join(__dirname, "..", "circuits", `${name}.circom`);
  return tester(circuitFile, { output: "./circom" });
}

async function getBoardHash(circuit, params = {}) {
  let witness = null;
  return circuit
    .calculateWitness({
      ...DEFAULT_PARAMS,
      ...params,
    })
    .then((w) => {
      witness = w;
      return circuit.checkConstraints(w);
    })
    .then(() => {
      return witness[1];
    });
}

describe("Move Circuit Tests", () => {
  // this.timeout(100000);

  let createCircuit;
  let moveCircuit;

  before(async function () {
    this.timeout(100000);
    createCircuit = await getCircuit("create");
    moveCircuit = await getCircuit("move");
  });

  describe("Basic movement - player", function () {
    it("Should move (N)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {})
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.NORTH,
            turn: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0] + 1);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1]);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });

    it("Should move (E)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.EAST,
            turn: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0] + 1000);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1]);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });

    it("Should move (S)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.SOUTH,
            turn: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0] - 1);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1]);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });

    it("Should move (W)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.WEST,
            turn: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0] - 1000);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1]);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });
  });

  describe("Basic movement - opponent", function () {
    it("Should move (N)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.NORTH,
            turn: 1,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0]);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1] + 1);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });

    it("Should move (E)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.EAST,
            turn: 1,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0]);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1] + 1000);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });

    it("Should move (S)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.SOUTH,
            turn: 1,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0]);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1] - 1);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });

    it("Should move (W)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            move: CARDINALS.WEST,
            turn: 1,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerHP,
            opponentPosition,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.positions[0]);
          assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1] - 1000);
          assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
          assert.equal(opponentHP, DEFAULT_PARAMS.hp[1]);
        });
    });
  });

  it("Should do damage on a player attack", async () => {
    let witness = null;
    const positions = [2004, 2005];
    return getBoardHash(createCircuit, {
      positions,
    })
      .then((boardHash) => {
        return moveCircuit.calculateWitness({
          ...DEFAULT_PARAMS,
          boardHash,
          positions,
          move: CARDINALS.NORTH,
          turn: 0,
        });
      })
      .then((w) => {
        witness = w;
        return moveCircuit.checkConstraints(w);
      })
      .then(() => {
        const [
          playerPosition,
          playerHP,
          opponentPosition,
          opponentHP,
        ] = witness.slice(1, 7);
        assert.equal(playerPosition, 2004);
        assert.equal(playerHP, DEFAULT_PARAMS.hp[0]);
        assert.equal(opponentPosition, 2005);
        assert.equal(opponentHP, DEFAULT_PARAMS.hp[1] - 1);
      });
  });

  it("should allow chaining using the board result", async () => {
    let witness = null;
    let boardHash = 1;
    return getBoardHash(createCircuit, {})
      .then((bh) => {
        boardHash = bh;
        return moveCircuit.calculateWitness({
          ...DEFAULT_PARAMS,
          boardHash,
          move: 1,
          turn: 0,
        });
      })
      .then((w) => {
        witness = w;
        return moveCircuit.checkConstraints(w);
      })
      .then(() => {
        const playerPosition = witness[1];
        const opponentPosition = witness[4];
        const boardResult = witness[7]; // <-- new board hash
        assert.equal(playerPosition, DEFAULT_PARAMS.positions[0] + 1);
        assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1]); // hasn't moved
        assert.notEqual(boardHash, boardResult);
        return moveCircuit.calculateWitness({
          ...DEFAULT_PARAMS,
          boardHash: boardResult,
          positions: [playerPosition, opponentPosition],
          move: 3,
          turn: 1,
        });
      })
      .then((w) => {
        const playerPosition = w[1];
        const opponentPosition = w[4];
        assert.equal(playerPosition, DEFAULT_PARAMS.positions[0] + 1);
        assert.equal(opponentPosition, DEFAULT_PARAMS.positions[1] - 1); // second move - one S for opponent
      });
  });
});

/*
        console.log(`Results:
          playerPosition: ${playerPosition}
          playerHP: ${playerHP}
          opponentPosition: ${opponentPosition}
          opponentHP: ${opponentHP}
        `);
*/
