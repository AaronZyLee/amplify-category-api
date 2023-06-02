#!/bin/sh

# set exit on error to true
set -e

echo "Environment credentials"
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
echo $AWS_SESSION_TOKEN

echo "User Identity Account"
echo $(aws sts get-caller-identity | jq -cr '.Account')

echo "Refreshing temporary credentials"
echo "Unassume Role"
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN

echo "Environment credentials"
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
echo $AWS_SESSION_TOKEN

echo "User Identity Account"
echo $(aws sts get-caller-identity | jq -cr '.Account')

echo "ASSUMING PARENT TEST ACCOUNT credentials"
session_id=1248634
# Use longer time for parent account role
creds=$(aws sts assume-role --role-arn $TEST_ACCOUNT_ROLE --role-session-name testSession${session_id} --duration-seconds 3600)
if [ -z $(echo $creds | jq -c -r '.AssumedRoleUser.Arn') ]; then
    echo "Unable to assume parent e2e account role."
    return
fi
echo "Using account credentials for $(echo $creds | jq -c -r '.AssumedRoleUser.Arn')"
export AWS_ACCESS_KEY_ID=$(echo $creds | jq -c -r ".Credentials.AccessKeyId")
export AWS_SECRET_ACCESS_KEY=$(echo $creds | jq -c -r ".Credentials.SecretAccessKey")
export AWS_SESSION_TOKEN=$(echo $creds | jq -c -r ".Credentials.SessionToken")

echo "Environment credentials"
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
echo $AWS_SESSION_TOKEN

echo "User Identity Account"
echo $(aws sts get-caller-identity | jq -cr '.Account')
