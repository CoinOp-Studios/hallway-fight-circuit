#!/bin/sh
set -e
set -x
rm -rf circom
mkdir -p circom/create
mkdir -p circom/move

circom circuits/create.circom --r1cs --wasm -o circom/create
circom circuits/move.circom --r1cs --wasm -o circom/move

