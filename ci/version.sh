#!/bin/bash
set -eu
IFS=$'\n\t'

echo "Bump code version"

git config user.name 'cdp-gh-bot[bot]'
git config user.email '131385681+cdp-gh-bot[bot]@users.noreply.github.com'

if test -f ci/build.manifest; then
    . ci/build.manifest
fi

echo "Fetch all tags"

git fetch --depth=1 origin +refs/tags/*:refs/tags/*

NPM_VERSION=$(npm pkg get version | xargs)

if [ $(git tag -l "$NPM_VERSION") ]; then
# If current version tag exists on GitHub then bump minor version and push commit and tag
    npm version minor
    NEW_NPM_VERSION=$(npm pkg get version | xargs)

    echo "NPM version bumped to $NEW_NPM_VERSION"

    git tag "$NEW_NPM_VERSION"
    git push
    git push origin "$NEW_NPM_VERSION"
else
# If current version tag does not exist on GitHub then tag code and push tag.
# This will happen with developer created Major or Patch, or initial release

    echo "$NPM_VERSION tag does not exist, creating tag $NPM_VERSION"

    git tag "$NPM_VERSION"
    git push origin "$NPM_VERSION"
fi


