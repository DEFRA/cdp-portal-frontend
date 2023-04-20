#!/bin/bash
set -eu
IFS=$'\n\t'

SEMVER_STRING=$1

echo "Bump code version"

git config user.name "feedmypixel"
git config user.email "ben@feedmypixel.com"

npm version "$SEMVER_STRING"
git push
git push --tags
