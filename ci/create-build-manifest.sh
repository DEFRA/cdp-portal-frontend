#!/bin/bash
set -eu
IFS=$'\n\t'

# Creating a build manifest to:
# - Easily track what was built
# - Simply pass variables to later steps in the pipeline

SERVICE_NAME="cdp-portal-frontend"
GIT_REPOSITORY_URL=$(git remote get-url origin)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
GIT_SHORT_REVISION=$(git rev-parse --short --abbrev-commit HEAD)
VERSION=$(npm pkg get version)

echo "Building build.manifest"

cat <<EOF > ci/build.manifest
#!/bin/sh
# Generated build manifest for $SERVICE_NAME
SERVICE_NAME="$SERVICE_NAME"
BUILD_GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"
BUILD_GIT_BRANCH="$GIT_BRANCH"
BUILD_GIT_SHORT_REVISION="$GIT_SHORT_REVISION"
BUILD_VERSION=$VERSION
EOF
