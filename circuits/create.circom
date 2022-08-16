pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template HallFightCreate() {
  signal input nonce;
  signal input board; // x * 1000 + y
  signal input start; // x * 1000 + y
  signal input move; // single move - will be low four bits - used for facing
  signal output out;

  var boardY = board % 1000;
  var boardX = (board - boardY) / 1000;
  var posX = start % 1000;
  var posY = (start-posX) / 1000;

  assert(
    (boardX > posX + 1) 
    && posX > 0
    && posY > -1
    && move > 0
    && move < 16
    && boardY >= posY
  );

  // Verify position
  component poseidon = Poseidon(4);
  poseidon.inputs[0] <== nonce;
  poseidon.inputs[1] <== board;
  poseidon.inputs[2] <== start;
  poseidon.inputs[3] <== move;

  out <-- poseidon.out;
}

component main = HallFightCreate();
