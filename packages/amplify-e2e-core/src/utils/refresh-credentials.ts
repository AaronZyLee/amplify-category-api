const { execSync } = require("child_process");
import _ from "lodash";

export const refreshCredentials = () => {
  const stringifedCreds = execSync(`./refresh-credentials.sh`, { shell: true })?.toString();

  if (!_.isEmpty(stringifedCreds)) {
    const creds = JSON.parse(stringifedCreds);
    if (creds?.AWS_ACCESS_KEY_ID && creds?.AWS_SECRET_ACCESS_KEY && creds?.AWS_SESSION_TOKEN) {
      return creds;
    }
  }

  return;
};
