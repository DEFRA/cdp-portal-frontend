#!/bin/bash
set -eu
IFS=$'\n\t'

echo "Bump code version"

git config user.name 'cdp-gh-bot[bot]'
git config user.email '131385681+cdp-gh-bot[bot]@users.noreply.github.com'

if test -f ci/build.manifest; then
    . ci/build.manifest
fi

if [ $(git tag -l "$BUILD_VERSION") ]; then
# If current version tag exists on GitHub then bump minor version and push commit and tag
    npm version minor
    NEW_VERSION=$(npm pkg get version)

    git push
    git push origin "$NEW_VERSION"
else
# If current version tag does not exist on GitHub then tag code and push tag.
# This will happen with developer created Major or Patch, or initial release
    git tag "$BUILD_VERSION"
    git push origin "$BUILD_VERSION"
fi


