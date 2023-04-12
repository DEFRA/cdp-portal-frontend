#!/bin/bash
set -eu
IFS=$'\n\t'

if test -f ci/build.manifest; then
    . ci/build.manifest
fi

IMAGE="$SERVICE_NAME:$BUILD_VERSION"
IMAGE_LATEST_TAG="$ECR_REGISTRY/$SERVICE_NAME:latest"
IMAGE_BUILD_VERSION_TAG="$ECR_REGISTRY/$SERVICE_NAME:$BUILD_VERSION"

echo "Tagging $IMAGE as :latest and $BUILD_VERSION"
docker tag "$IMAGE" "$IMAGE_LATEST_TAG"
docker tag "$IMAGE" "$IMAGE_BUILD_VERSION_TAG"

echo "Pushing $IMAGE_LATEST_TAG and $IMAGE_BUILD_VERSION_TAG"
docker push "$IMAGE_LATEST_TAG"
docker push "$IMAGE_BUILD_VERSION_TAG"
