#!/bin/bash
set -eu
IFS=$'\n\t'

SEMVER_STRING=$1

echo "Bump code version"

git config user.name 'cdp-gh-bot[bot]'
git config user.email '131385681+cdp-gh-bot[bot]@users.noreply.github.com'

npm version "$SEMVER_STRING"
git push
git push --tags
