#!/bin/bash
set -eu
IFS=$'\n\t'

SEMVER_STRING=$1

git config user.name "CDPScaffolder[bot]"
git config user.email "279065+CDPScaffolder[bot]@users.noreply.github.com"

echo "Bump code version"

npm version "$SEMVER_STRING"
git push --force-with-lease
git push --tags
