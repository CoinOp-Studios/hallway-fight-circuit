pragma solidity ^0.8.0;

interface ICreateVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[7] memory input
    ) external returns (bool);
}

interface IMoveVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[14] memory input
    ) external returns (bool);
}

contract HallFightGame {
  ICreateVerifier public immutable createVerifier;
  IMoveVerifier public immutable moveVerifier;

  constructor(
    ICreateVerifier _createVerifier,
    IMoveVerifier _moveVerifier
  ) {
    createVerifier = _createVerifier;
    moveVerifier = _moveVerifier;
  }

  function requireCreateProof(
    bytes calldata _proof,
    uint256 _boardHash
  ) internal {
    uint256[8] memory p = abi.decode(_proof, (uint256[8]));
    require(
      createVerifier.verifyProof(
        [p[0], p[1]],
        [[p[2], p[3]], [p[4], p[5]]],
        [p[6], p[7]],
        [_boardHash]
      ),
      "Invalid board state (ZK)"
    );
  }

  function requireMoveProof(
    bytes calldata _proof,
    uint256 _boardHash,
    bool isHit,
    uint x,
    uint y
  ) internal {
    uint256[6] memory p = abi.decode(_proof, (uint256[6]));
    require(
      moveVerifier.verifyProof(
        [p[0], p[1]],
        [[p[2], p[3]], [p[4], p[5]]],
        [p[6], p[7]],
        [isHit ? 1 : 0, _boardHash, x, y]
      ),
      "Invalid move (ZK)"
    );
  }

}