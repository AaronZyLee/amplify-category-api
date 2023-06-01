const { execSync } = require("child_process");
import { resolve } from 'path';
import { existsSync } from 'fs-extra';

let commandOne = "source ./shared-scripts.sh";
let commandTwo = "_refreshCredentials"; // print the current user
let commandThree = "pwd"; //print the name of current directory

export const refreshCredentials = () => {
  const pathToScript = resolve(`${__dirname}/../../../..`);
  console.log(pathToScript);
  const pathToSourceDir = process.env.CODEBUILD_SRC_DIR;
  console.log(`script path exists: ${existsSync(pathToScript)}`);
  const pathToBash = execSync('which bash').toString();
  console.log(`Found bash: ${pathToBash}`);
  const listFiles = execSync(`ls`, { cwd: pathToSourceDir, shell: pathToBash });
  console.log(listFiles?.toString());
  const result = execSync(`${commandThree} && ${commandOne} && ${commandTwo} && ${commandThree}`, { cwd: pathToSourceDir, shell: pathToBash });
  console.log(result?.toString());
  console.log(JSON.stringify(result));
  return;
};

/*
export const refreshCredentials = (cwd: string)
: Promise<any> => new Promise((resolve, reject) => {
  console.log(`running from ${cwd}`);

  spawn('./shared-scripts.sh', ['_refreshCredentials'], { cwd: '/Users/edupp/Documents/git_repos/git_data/cb-git/amplify-category-api', stripColors: true })
    .run((err: Error) => {
      if (!err) {
        resolve({});
      } else {
        reject(err);
      }
    });
});
*/
