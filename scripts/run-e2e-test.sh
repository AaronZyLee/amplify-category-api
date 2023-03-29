#!/bin/bash

echo "export PATH=$AMPLIFY_DIR:$PATH" >> $BASH_ENV
source $BASH_ENV
source .circleci/local_publish_helpers.sh
amplify version