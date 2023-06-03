#!/bin/sh

# set exit on error to true
set -e

# Un-assume the current role
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN

# Re-assume the e2e test account role
session_id=$(od -An -N2 -i /dev/urandom | awk '{print $1}' | sed 's/^0*//' | head -n 1)
creds=$(aws sts assume-role --role-arn $TEST_ACCOUNT_ROLE --role-session-name testSession${session_id} --duration-seconds 3600)
if [ -z $(echo $creds | jq -c -r '.AssumedRoleUser.Arn') ]; then
    return
fi

echo "{ \"AWS_ACCESS_KEY_ID\": \"$AWS_ACCESS_KEY_ID\", \"AWS_SECRET_ACCESS_KEY\": \"$AWS_SECRET_ACCESS_KEY\", \"AWS_SESSION_TOKEN\": \"$AWS_SESSION_TOKEN\" }"
