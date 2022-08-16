pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "./util.circom";

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
  signal output boardResult;

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

  signal areFacing <-- (
    (playerMove && mover(player, 5, playerFacing) == opponent)
    || (!playerMove && mover(opponent, 5, opponentFacing) == player)
  );

  signal isAttack <-- playerMove == 6 || opponentMove == 6;

  assert(areFacing || !isAttack); // attack must be facing each other.

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
  playerPosition <-- mover(player, playerMove, playerFacing);
  opponentPosition <-- mover(opponent, opponentMove, opponentFacing);
  assert(playerPosition != opponentPosition);
  finalPlayerHP <-- opponentMove == 6 ? playerHP - 1 : playerHP;
  finalOpponentHP <-- playerMove == 6 ? opponentHP - 1 : opponentHP;

  finalPlayerFacing <-- (playerMove > 0 && playerMove < 5) ? playerMove : playerFacing;
  finalOpponentFacing <-- (opponentMove > 0 && opponentMove < 5) ? opponentMove : opponentFacing;

  component poseidon2 = Poseidon(8);
  poseidon2.inputs[0] <== nonce;
  poseidon2.inputs[1] <== board;
  poseidon2.inputs[2] <== playerPosition;
  poseidon2.inputs[3] <== finalPlayerFacing;
  poseidon2.inputs[4] <== finalPlayerHP;
  poseidon2.inputs[5] <== opponentPosition;
  poseidon2.inputs[6] <== finalOpponentFacing;
  poseidon2.inputs[7] <== finalOpponentHP;
  boardResult <== poseidon2.out;
}

component main = HallMove();
