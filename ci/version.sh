#!/bin/bash
set -eu
IFS=$'\n\t'

SEMVER_STRING=$1

git config --global user.name "GitHub Actions Robot 🤖"
git config --global user.email ""

echo "Bump code version"

npm version "$SEMVER_STRING"
git push
git push --tags
