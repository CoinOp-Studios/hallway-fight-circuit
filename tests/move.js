const chai = require("chai");
const path = require("path");
const tester = require("circom_tester").wasm;

const assert = chai.assert;

const DEFAULT_PARAMS = {
  nonce: 1,
  board: 10008,
  start: 1004,
  move: 1,
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
      console.log("Board hash:", witness[1]);
      return witness[1];
    });
}

describe("Move Circuit Tests", () => {
  // this.timeout(100000);

  let createCircuit;
  let moveCircuit;

  before(async () => {
    createCircuit = await getCircuit("create");
    moveCircuit = await getCircuit("move");
  });

  it("Should move forward", async () => {
    const boardHash = await getBoardHash(createCircuit, {});
    const witness = await moveCircuit.calculateWitness({
      ...DEFAULT_PARAMS,
      boardHash,
      move: 0x15,
      turn: 2,
    });
    await moveCircuit.checkConstraints(witness);
    assert(witness[1]) === 5;
  });
});
