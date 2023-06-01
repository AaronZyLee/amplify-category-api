const { execSync } = require("child_process");
import { resolve } from 'path';

let commandOne = "source ./shared-scripts.sh";
let commandTwo = "_refreshCredentials"; // print the current user
let commandThree = "pwd"; //print the name of current directory

export const refreshCredentials = () => {
  const pathToScript = resolve(`${__dirname}/../../../..`);
  console.log(pathToScript);
  execSync(`${commandThree} && ${commandOne} && ${commandTwo} && ${commandThree}`, { cwd: pathToScript });
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
