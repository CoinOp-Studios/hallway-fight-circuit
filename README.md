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

| Name        | Value | Description    |
| ----------- | ----- | -------------- |
| NULL        | 0     | reserved       |
| FORWARD     | 1     | move forward   |
| ATTACK      | 2     | attack forward |
| TURN_R      | 3     | turn right     |
| TURN_L      | 4     | turn left      |
| TURN_AROUND | 5     | turn around    |
