#!/bin/bash
set -eu
IFS=$'\n\t'

echo "Running code lint"
npm run lint

echo "Running unit tests"
npm test
