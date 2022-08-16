pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template HallFightCreate() {
  signal input nonce;
  signal input board; // x * 1000 + y
  signal input player; // x * 1000 + y
  signal input playerHP;
  signal input playerFacing;
  signal input opponent;
  signal input opponentHP;
  signal input opponentFacing;
  signal output boardHash;

  var boardY = board % 1000;
  var boardX = (board - boardY) / 1000;
  var playerY = player % 1000;
  var playerX = (player - playerY) / 1000;
  var oppY = opponent % 1000;
  var oppX = (opponent - oppY) / 1000;

  assert(playerFacing > 0 && playerFacing < 5); // player facing direction.
  assert(boardX > playerX + 1 && playerX > 0); // player position on the board.
  assert(boardY > playerY && playerY > -1); // player position on the board.
  assert(opponentFacing > 0 && opponentFacing < 5); // opponent facing direction.
  assert(boardX > oppX + 1 && oppX > 0); // opponent position on the board.
  assert(boardY > oppY && oppY > -1); // opponent position on the board.
  assert(playerHP > 0 && opponentHP > 0); // player and opponent HP.

  // Verify position
  component poseidon = Poseidon(8);
  poseidon.inputs[0] <== nonce;
  poseidon.inputs[1] <== board;
  poseidon.inputs[2] <== player;
  poseidon.inputs[3] <== playerFacing;
  poseidon.inputs[4] <== playerHP;
  poseidon.inputs[5] <== opponent;
  poseidon.inputs[6] <== opponentFacing;
  poseidon.inputs[7] <== opponentHP;

  boardHash <-- poseidon.out;
}

component main = HallFightCreate();
