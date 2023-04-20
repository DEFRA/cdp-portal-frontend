#!/bin/bash
set -eu
IFS=$'\n\t'

SEMVER_STRING=$1

echo "Bump code version"

npm version "$SEMVER_STRING"
git push
git push --tags
