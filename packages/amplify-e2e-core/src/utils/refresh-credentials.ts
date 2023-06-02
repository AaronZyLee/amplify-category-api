const { execSync } = require("child_process");
import _ from "lodash";

export const refreshCredentials = () => {
  console.log(execSync('ls').toString());

  const stringifedCreds = execSync(`./refresh-credentials.sh`, { shell: true })?.toString();
  console.log(`creds from js process: ${stringifedCreds}`);

  if (!_.isEmpty(stringifedCreds)) {
    const creds = JSON.parse(stringifedCreds);
    if (creds?.AWS_ACCESS_KEY_ID && creds?.AWS_SECRET_ACCESS_KEY && creds?.AWS_SESSION_TOKEN) {
      return creds;
    }
  }

  const result1 = execSync(`
  echo $AWS_ACCESS_KEY_ID
  echo $AWS_SECRET_ACCESS_KEY
  echo $AWS_SESSION_TOKEN
  `, { shell: true });
  console.log(result1?.toString());

  return;
};
