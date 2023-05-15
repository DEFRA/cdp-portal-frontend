#!/bin/bash
set -eu
IFS=$'\n\t'

VERSION_ZERO=0.0.0

echo "Bump code version"

git config user.name 'cdp-gh-bot[bot]'
git config user.email '131385681+cdp-gh-bot[bot]@users.noreply.github.com'

NPM_VERSION=$(npm pkg get version | xargs)

if [ "$NPM_VERSION" != "$VERSION_ZERO" ]; then
# If we are not on the first release and there are tags in GitHub
    echo "Fetch all tags"

    git fetch --depth=1 origin +refs/tags/*:refs/tags/*
fi

if [ $(git tag -l "$NPM_VERSION") ] || [ "$NPM_VERSION" == "$VERSION_ZERO" ]; then
# If current version tag exists on GitHub then bump minor version and push commit and tag
    npm version minor
    NEW_NPM_VERSION=$(npm pkg get version | xargs)

    echo "NPM version bumped to $NEW_NPM_VERSION"

    if [ $(git tag -l "$NEW_NPM_VERSION") ]; then
      echo "$NEW_NPM_VERSION tag already exists, this a re-run of a failed CI job, skipping tag push"
    else
      git tag "$NEW_NPM_VERSION"
      git push
      git push origin "$NEW_NPM_VERSION"
    fi
else
# If current version tag does not exist on GitHub then tag code and push tag.
# This will happen when a developer manually versions a Major or Patch, or initial release
    echo "$NPM_VERSION tag does not exist, creating tag $NPM_VERSION"

    git tag "$NPM_VERSION"
    git push origin "$NPM_VERSION"
fi
