const chai = require("chai");
const path = require("path");
const tester = require("circom_tester").wasm;

const assert = chai.assert;

const DEFAULT_PARAMS = {
  nonce: 1,
  board: 10008,
  player: 4001,
  playerFacing: 1,
  playerHP: 10,
  opponent: 8002,
  opponentFacing: 3,
  opponentHP: 10,
};

describe("Create Circuit Tests", function () {
  this.timeout(100000);

  let createCircuit;

  before(async () => {
    console.log("dir", __dirname);
    const circuitFile = path.join(__dirname, "..", "circuits", "create.circom");
    console.log("circuitFile", circuitFile);
    createCircuit = await tester(circuitFile, { output: "./circom" });
  });

  it("Should setup on happy path", async () => {
    const witness = await createCircuit.calculateWitness(DEFAULT_PARAMS);

    await createCircuit.checkConstraints(witness);
  });

  it("Should fail with invalid starting location", async () => {
    let errored = false;
    return createCircuit
      .calculateWitness({
        ...DEFAULT_PARAMS,
        player: 11004,
      })
      .then((witness) => {
        return createCircuit.checkConstraints(witness);
      })
      .catch((err) => {
        errored = true;
      })
      .finally(() => {
        assert(errored, "Should have errored");
      });
  });
});
