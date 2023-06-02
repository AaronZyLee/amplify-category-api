const { execSync } = require("child_process");
import { resolve } from 'path';
import { existsSync } from 'fs-extra';

export const refreshCredentials = () => {
  // const pathToScript = resolve(`${__dirname}/../../../..`);
  // console.log(pathToScript);
  // const pathToSourceDir = process.env.CODEBUILD_SRC_DIR;
  // console.log(`script path exists: ${existsSync(pathToScript)}`);
  // console.log(`src path exists: ${existsSync(pathToSourceDir)}`);
  // const pathToBash = execSync('which bash').toString();
  // console.log(`Found bash: ${pathToBash}`);
  const listCurrFiles = execSync('pwd');
  console.log(listCurrFiles?.toString());
  console.log(execSync('ls').toString());

  const result = execSync(`./refresh-credentials.sh`, { shell: true });
  console.log(result?.toString());
  console.log(JSON.stringify(result));
  return;
};
