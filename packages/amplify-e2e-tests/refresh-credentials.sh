#!/bin/sh

# set exit on error to true
set -e

function _unassumeTestAccountCredentials {
    echo "Unassume Role"
    unset AWS_ACCESS_KEY_ID
    unset AWS_SECRET_ACCESS_KEY
    unset AWS_SESSION_TOKEN
}

function _checkEnvCreds {
    echo "Environment credentials"
    echo $AWS_ACCESS_KEY_ID
    echo $AWS_SECRET_ACCESS_KEY
    echo $AWS_SESSION_TOKEN
}

function _logUserIdentity {
    echo "User Identity Account"
    echo $(aws sts get-caller-identity | jq -cr '.Account')
}

function _refreshCredentials {
    echo "Refreshing temporary credentials"
    _checkEnvCreds
    _logUserIdentity
    _unassumeTestAccountCredentials

    echo "After clearing current credentials"
    _checkEnvCreds
    _logUserIdentity
    _loadTestAccountCredentials

    echo "After resetting temp credentials"
    _checkEnvCreds
    _logUserIdentity
}

function _loadTestAccountCredentials {
    echo ASSUMING PARENT TEST ACCOUNT credentials
    session_id=$((1 + $RANDOM % 10000))
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
}

_refreshCredentials
