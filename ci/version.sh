#!/bin/bash
set -eu
IFS=$'\n\t'

SEMVER_STRING=$1

echo "Bump code version"

git config user.name 'github-actions[bot]'
git config user.email 'github-actions[bot]@users.noreply.github.com'

npm version "$SEMVER_STRING"
git push
git push --tags
