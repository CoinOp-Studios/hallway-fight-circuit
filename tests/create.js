const { throws } = require("assert");
const chai = require("chai");
const { appendFileSync } = require("fs");
const path = require("path");
const Scalar = require("ffjavascript").Scalar;
const F1Field = require("ffjavascript").F1Field;
const utils = require("ffjavascript").utils;
const tester = require("circom_tester").wasm;

const assert = chai.assert;

describe("Move Circuit Tests", () => {
  // this.timeout(100000);

  let createCircuit;

  before(async () => {
    console.log("dir", __dirname);
    const circuitFile = path.join(__dirname, "..", "circuits", "create.circom");
    console.log("circuitFile", circuitFile);
    createCircuit = await tester(circuitFile, { output: "./circom" });
  });

  it("Should setup on happy path", async () => {
    const witness = await createCircuit.calculateWitness({
      nonce: 1,
      board: 10008,
      start: 1004,
      move: 1,
    });

    await createCircuit.checkConstraints(witness);
  });

  it("Should fail with invalid starting location", async () => {
    let errored = false;
    return createCircuit
      .calculateWitness({
        nonce: 1,
        board: 10008,
        start: 11004,
        move: 1,
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
