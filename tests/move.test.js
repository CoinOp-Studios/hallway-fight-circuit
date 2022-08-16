const chai = require("chai");
const path = require("path");
const tester = require("circom_tester").wasm;

const assert = chai.assert;

const DEFAULT_PARAMS = {
  nonce: 1,
  board: 10010,
  player: 4001,
  playerFacing: 1,
  playerHP: 20,
  opponent: 8009,
  opponentFacing: 3,
  opponentHP: 10,
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
    it("Should move forward (N)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {})
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerMove: 5,
            opponentMove: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, 4002);
          assert.equal(playerFacing, DEFAULT_PARAMS.playerFacing);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent);
          assert.equal(opponentFacing, DEFAULT_PARAMS.opponentFacing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });

    it("Should move forward (E)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
        playerFacing: 2,
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerFacing: 2,
            playerMove: 5,
            opponentMove: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, 5001);
          assert.equal(playerFacing, 2);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent);
          assert.equal(opponentFacing, DEFAULT_PARAMS.opponentFacing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });

    it("Should move forward (S)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
        playerFacing: 3,
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerFacing: 3,
            playerMove: 5,
            opponentMove: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, 4000);
          assert.equal(playerFacing, 3);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent);
          assert.equal(opponentFacing, DEFAULT_PARAMS.opponentFacing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });

    it("Should move forward (W)", async () => {
      let witness = null;
      return getBoardHash(createCircuit, {
        playerFacing: 4,
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerFacing: 4,
            playerMove: 5,
            opponentMove: 0,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, 3001);
          assert.equal(playerFacing, 4);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent);
          assert.equal(opponentFacing, DEFAULT_PARAMS.opponentFacing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });
  });
  describe("Basic movement - opponent", function () {
    it("Should move forward (N)", async () => {
      let witness = null;
      let facing = 1;
      return getBoardHash(createCircuit, {
        opponentFacing: facing,
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerMove: 0,
            opponentFacing: facing,
            opponentMove: 5,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.player);
          assert.equal(playerFacing, DEFAULT_PARAMS.playerFacing);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent + 1);
          assert.equal(opponentFacing, facing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });

    it("Should move forward (E)", async () => {
      let witness = null;
      let facing = 2;
      return getBoardHash(createCircuit, {
        opponentFacing: facing,
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerMove: 0,
            opponentFacing: facing,
            opponentMove: 5,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.player);
          assert.equal(playerFacing, DEFAULT_PARAMS.playerFacing);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent + 1000);
          assert.equal(opponentFacing, facing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });

    it("Should move forward (S)", async () => {
      let witness = null;
      let facing = 3;
      return getBoardHash(createCircuit, {
        opponentFacing: facing,
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerMove: 0,
            opponentFacing: facing,
            opponentMove: 5,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.player);
          assert.equal(playerFacing, DEFAULT_PARAMS.playerFacing);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent - 1);
          assert.equal(opponentFacing, facing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });

    it("Should move forward (W)", async () => {
      let witness = null;
      let facing = 4;
      return getBoardHash(createCircuit, {
        opponentFacing: facing,
      })
        .then((boardHash) => {
          return moveCircuit.calculateWitness({
            ...DEFAULT_PARAMS,
            boardHash,
            playerMove: 0,
            opponentFacing: facing,
            opponentMove: 5,
          });
        })
        .then((w) => {
          witness = w;
          return moveCircuit.checkConstraints(w);
        })
        .then(() => {
          const [
            playerPosition,
            playerFacing,
            playerHP,
            opponentPosition,
            opponentFacing,
            opponentHP,
          ] = witness.slice(1, 7);
          assert.equal(playerPosition, DEFAULT_PARAMS.player);
          assert.equal(playerFacing, DEFAULT_PARAMS.playerFacing);
          assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
          assert.equal(opponentPosition, DEFAULT_PARAMS.opponent - 1000);
          assert.equal(opponentFacing, facing);
          assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP);
        });
    });
  });

  it("Should not allow movement to same location", async () => {
    let witness = null;
    let errored = false;
    return getBoardHash(createCircuit, {
      playerFacing: 1,
      opponentFacing: 3,
      player: 2004,
      opponent: 2005,
    })
      .then((boardHash) => {
        return moveCircuit.calculateWitness({
          ...DEFAULT_PARAMS,
          boardHash,
          playerFacing: 1,
          opponentFacing: 3,
          player: 2004,
          opponent: 2005,
          playerMove: 5,
          opponentMove: 0,
        });
      })
      .then((w) => {
        witness = w;
        return moveCircuit.checkConstraints(w);
      })
      .catch((err) => {
        assert(err.message.indexOf("Assert Failed") > -1);
        errored = true;
      })
      .finally(() => {
        assert.isTrue(errored);
      });
  });

  it("Should not allow an attack unless facing", async () => {
    let witness = null;
    let errored = false;
    return getBoardHash(createCircuit, {
      playerFacing: 1,
      opponentFacing: 3,
      player: 9002,
      opponent: 2005,
    })
      .then((boardHash) => {
        return moveCircuit.calculateWitness({
          ...DEFAULT_PARAMS,
          boardHash,
          playerFacing: 1,
          opponentFacing: 3,
          player: 2004,
          opponent: 2005,
          playerMove: 6,
          opponentMove: 0,
        });
      })
      .then((w) => {
        witness = w;
        return moveCircuit.checkConstraints(w);
      })
      .catch((err) => {
        assert(err.message.indexOf("Assert Failed") > -1);
        errored = true;
      })
      .finally(() => {
        assert.isTrue(errored);
      });
  });

  it("Should do damage on a player attack", async () => {
    let witness = null;
    let errored = false;
    return getBoardHash(createCircuit, {
      playerFacing: 1,
      opponentFacing: 3,
      player: 2004,
      opponent: 2005,
    })
      .then((boardHash) => {
        return moveCircuit.calculateWitness({
          ...DEFAULT_PARAMS,
          boardHash,
          playerFacing: 1,
          opponentFacing: 3,
          player: 2004,
          opponent: 2005,
          playerMove: 6,
          opponentMove: 0,
        });
      })
      .then((w) => {
        witness = w;
        return moveCircuit.checkConstraints(w);
      })
      .then(() => {
        const [
          playerPosition,
          playerFacing,
          playerHP,
          opponentPosition,
          opponentFacing,
          opponentHP,
        ] = witness.slice(1, 7);
        assert.equal(playerPosition, 2004);
        assert.equal(playerFacing, 1);
        assert.equal(playerHP, DEFAULT_PARAMS.playerHP);
        assert.equal(opponentPosition, 2005);
        assert.equal(opponentFacing, 3);
        assert.equal(opponentHP, DEFAULT_PARAMS.opponentHP - 1);
      });
  });
});

/*
        console.log(`Results:
          playerPosition: ${playerPosition}
          playerFacing: ${playerFacing}
          playerHP: ${playerHP}
          opponentPosition: ${opponentPosition}
          opponentFacing: ${opponentFacing}
          opponentHP: ${opponentHP}
        `);
*/
