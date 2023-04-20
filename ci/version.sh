#!/bin/bash
set -eu
IFS=$'\n\t'

SEMVER_STRING=$1

git config user.name 'github-actions[bot]'
git config user.email 'github-actions[bot]@users.noreply.github.com'

echo "Bump code version"

npm version "$SEMVER_STRING"
git push
git push --tags
