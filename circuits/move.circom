pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template HallMove() {
  signal input boardHash;
  signal input nonce;
  signal input board; // x * 1000 + y
  signal input start; // x * 1000 + y
  signal input move; // moves - packed integer
  signal input turn;
  signal output out;

  var boardY = board % 1000;
  var boardX = (board - boardY) / 1000;
  var posX = start % 1000;
  var posY = (start-posX) / 1000;

  var firstMove = move >> ((turn-1) * 4) & 0xF;

  assert(boardX > posX + 1); // "X Position out of upper bounds"
  assert(posX > 0); // "X Position out of lower bounds"
  assert(boardY > posY); // "Y Position out of upper bounds"
  assert(posY > 0); // "Y Position out of lower bounds"
  assert(turn > 1); // "Turn out of bounds"
  assert (firstMove > 0 && firstMove < 5); // "Invalid Move"

  /* for (var index=1; index < turn; index++) {
    var m = move >> (index * 4) & 0xF;
    assert(m > 0 && m < 16);  // zero is empty
  }
 */
  // Verify position
  component poseidon = Poseidon(4); // nonce, board, positionX, positionY
  poseidon.inputs[0] <== nonce;
  poseidon.inputs[1] <== board;
  poseidon.inputs[2] <== start;
  poseidon.inputs[3] <-- firstMove;
  assert (poseidon.out == boardHash);

  out <-- move & 0xF;
}

component main = HallMove();
