#!/bin/bash

source .circleci/local_publish_helpers.sh
export PATH=$AMPLIFY_DIR:$PATH
echo "using Amplify CLI version: "$(amplify --version)
amplify --version
echo "Run Amplify E2E tests"
echo $TEST_SUITE
retry runE2eTest