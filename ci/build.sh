#!/bin/bash
set -eu
IFS=$'\n\t'

if test -f ci/build.manifest; then
    . ci/build.manifest
fi

echo "Building docker image and tagging as $SERVICE_NAME:latest and $SERVICE_NAME:$BUILD_VERSION"

docker build \
          --no-cache \
          --tag "$SERVICE_NAME":latest \
          --tag "$SERVICE_NAME:$BUILD_VERSION" \
          --label defra.cdp.git.repo.url="$BUILD_GIT_REPOSITORY_URL" \
          --label defra.cdp.service.name="$SERVICE_NAME" .
