# Hallway Fight Circuit

A testbed for testing Circom circuits.

## How To

### Install

Install 'Circom' using their [downloads](https://docs.circom.io/downloads/downloads/).

`yarn install`

### Test

`yarn mocha tests`

## Basic concepts of the "arena"

### Location

Always specified as (x \* 1000) + y. This allows us to encode [x, y] using one parameter.

### Facing

Starting: N=1, E=2, S=3, W=4

### Commands

| Name    | Value | Description       |
| ------- | ----- | --------------    |
| NULL    | 0     | reserved          |
| MOVE_N  | 1     | move or attack N  |
| MOVE_E  | 2     | move or attack E  |
| MOVE_S  | 3     | move or attack S  |
| MOVE_W  | 4     | move or attack W  |

## Circuits

```mermaid
sequenceDiagram
  actor Player
  actor Backend
  actor Blockchain
  actor Executor
  Player->>Blockchain: Initialize Game
  Blockchain->>Player: send BoardHash
  Blockchain->>Executor: game available
  Executor->>Backend: game available
  Backend->>Blockchain: Join game
  Blockchain->>Executor: start game
  Executor->>Player: Ready
  Player->>Backend: make move
  Backend->>Player: make move
  Player-->Backend: repeat per turn
  Player-->>Blockchain: appeal invalid move
  Backend-->>Blockchain: appeal invalid move
  Blockchain-->>Executor: appeal
  Player-->Blockchain: end game
```

Where - "executor" is GraphQL plus something like Gelato or Chainlink Keepers.
