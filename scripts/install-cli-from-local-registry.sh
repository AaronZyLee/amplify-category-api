#!/bin/bash

source .circleci/local_publish_helpers.sh
startLocalRegistry "$(pwd)/.circleci/verdaccio.yaml"
setNpmRegistryUrlToLocal
changeNpmGlobalPath
npm install -g @aws-amplify/cli-internal
echo "using Amplify CLI version: "$(amplify --version)
unsetNpmRegistryUrl