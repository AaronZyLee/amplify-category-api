#!/bin/bash

source .circleci/local_publish_helpers.sh
startLocalRegistry "$(pwd)/.circleci/verdaccio.yaml"
setNpmRegistryUrlToLocal
git config user.email not@used.com
git config user.name "Doesnt Matter"
setNpmTag
if [ -z $NPM_TAG ]; then
  yarn publish-to-verdaccio
else
  yarn lerna publish --exact --dist-tag=latest --preid=$NPM_TAG --conventional-commits --conventional-prerelease --no-verify-access --yes --no-commit-hooks --no-push --no-git-tag-version
fi
unsetNpmRegistryUrl