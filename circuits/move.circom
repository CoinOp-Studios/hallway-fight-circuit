pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

function moveForward(position, facing) {
  var y = position % 1000;
  var x = (position - y) / 1000;
  if (facing == 1) {
    return x * 1000 + y + 1;
  } else if (facing == 2) {
    return (x + 1) * 1000 + y;
  } else if (facing == 3) {
    return x * 1000 + y - 1;
  } else {
    return (x - 1) * 1000 + y;
  }
}

template HallMove() {
  signal input boardHash;
  signal input nonce;
  signal input board; // x * 1000 + y
  signal input player; // x * 1000 + y
  signal input playerFacing;
  signal input playerHP;
  signal input opponent;
  signal input opponentFacing;
  signal input opponentHP;
  signal input playerMove;
  signal input opponentMove;
  signal output playerPosition;
  signal output finalPlayerFacing;
  signal output finalPlayerHP;
  signal output opponentPosition;
  signal output finalOpponentFacing;
  signal output finalOpponentHP;

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

  // player move or opponent move - XOR
  // assert(playerMove ? !opponentMove : opponentMove);
  assert(!playerMove != !opponentMove);

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

  assert(boardHash == poseidon.out);

  playerPosition <-- playerMove == 5 ? moveForward(player, playerFacing) : player;
  finalPlayerHP <-- playerHP;
  finalPlayerFacing <-- (playerMove > 0 && playerMove < 5) ? playerMove : playerFacing;
  opponentPosition <-- opponentMove == 5 ? moveForward(opponent, opponentFacing) : opponent;
  finalOpponentFacing <-- (opponentMove > 0 && opponentMove < 5) ? opponentMove : opponentFacing;
  finalOpponentHP <-- opponentHP;
}

component main = HallMove();
