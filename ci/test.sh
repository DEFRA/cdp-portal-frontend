#!/bin/bash
set -eu
IFS=$'\n\t'

echo "Checking formatting"
npm run format:check

echo "Running code lint"
npm run lint

echo "Running unit tests"
npm test
