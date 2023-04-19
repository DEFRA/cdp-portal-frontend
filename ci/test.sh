#!/bin/bash
set -eu
IFS=$'\n\t'

echo "Linting code"
npm run lint
run npm test
