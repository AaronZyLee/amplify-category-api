const { execSync } = require("child_process");
import _ from "lodash";
import { writeFileSync, readFileSync } from "fs-extra";
import * as ini from 'ini';
import { pathManager } from "@aws-amplify/amplify-cli-core";

export const refreshCredentials = () => {
  const stringifedCreds = execSync(`./refresh-credentials.sh`, { shell: true })?.toString();

  if (!_.isEmpty(stringifedCreds)) {
    const creds = JSON.parse(stringifedCreds);
    if (creds?.AWS_ACCESS_KEY_ID && creds?.AWS_SECRET_ACCESS_KEY && creds?.AWS_SESSION_TOKEN) {
      refreshTestProfileCredentials(creds);
      return creds;
    }
  }
  return stringifedCreds;
};

export const refreshTestProfileCredentials = (creds: AWSTempCredentials) => {
  const profileName = 'amplify-integ-test-user';
  const credentialsContents = ini.parse(readFileSync(pathManager.getAWSCredentialsFilePath()).toString());
  credentialsContents[profileName] = credentialsContents[profileName] || {};
  credentialsContents[profileName].aws_access_key_id = creds.AWS_ACCESS_KEY_ID;
  credentialsContents[profileName].aws_secret_access_key = creds.AWS_SECRET_ACCESS_KEY;
  credentialsContents[profileName].aws_session_token = creds.AWS_SESSION_TOKEN;
  writeFileSync(pathManager.getAWSCredentialsFilePath(), ini.stringify(credentialsContents));
};

export type AWSTempCredentials = {
  AWS_ACCESS_KEY_ID: string,
  AWS_SECRET_ACCESS_KEY: string,
  AWS_SESSION_TOKEN: string
};

export const displaySharedCreds = () => {
  const profileName = 'amplify-integ-test-user';
  const credentialsContents = ini.parse(readFileSync(pathManager.getAWSCredentialsFilePath()).toString());
  console.log(`shared creds: ${ini.stringify(credentialsContents[profileName])}`)
};

export const displaySessionInfo = () => {
  const envVars = {
    acskey: process.env.AWS_ACCESS_KEY_ID
  };
  console.log(JSON.stringify(envVars));
  displaySharedCreds();
};

export const setCredsInEnv = (creds: AWSTempCredentials | undefined) => {
  if (creds) {
    process.env['AWS_ACCESS_KEY_ID'] = creds.AWS_ACCESS_KEY_ID;
    process.env['AWS_SECRET_ACCESS_KEY'] = creds.AWS_SECRET_ACCESS_KEY;
    process.env['AWS_SESSION_TOKEN'] = creds.AWS_SESSION_TOKEN;
  }
};
