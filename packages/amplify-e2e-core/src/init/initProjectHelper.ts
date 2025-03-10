import { nspawn as spawn, getCLIPath, getNpxPath, singleSelect, addCITags } from '..';
import { copySync, moveSync, readFile } from 'fs-extra';
import * as path from 'path';
import { KEY_DOWN_ARROW } from '../utils';
import { amplifyRegions } from '../configure';
import { EOL } from 'os';
import { v4 as uuid } from 'uuid';

const defaultSettings = {
  name: EOL,
  envName: 'integtest',
  editor: EOL,
  appType: EOL,
  framework: EOL,
  srcDir: EOL,
  distDir: EOL,
  buildCmd: EOL,
  startCmd: EOL,
  useProfile: EOL,
  profileName: EOL,
  region: process.env.CLI_REGION,
  local: false,
  disableAmplifyAppCreation: true,
  disableCIDetection: false,
  providerConfig: undefined,
  permissionsBoundaryArn: undefined,
};

export function initJSProjectWithProfile(cwd: string, settings?: Partial<typeof defaultSettings>): Promise<void> {
  const s = { ...defaultSettings, ...settings };
  let env;

  if (s.disableAmplifyAppCreation === true) {
    env = {
      CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
    };
  }

  addCITags(cwd);

  const cliArgs = ['init'];
  const providerConfigSpecified = !!s.providerConfig && typeof s.providerConfig === 'object';
  if (providerConfigSpecified) {
    cliArgs.push('--providers', JSON.stringify(s.providerConfig));
  }

  if (s.permissionsBoundaryArn) {
    cliArgs.push('--permissions-boundary', s.permissionsBoundaryArn);
  }

  if (s?.name?.length > 20) console.warn('Project names should not be longer than 20 characters. This may cause tests to break.');

  return new Promise((resolve, reject) => {
    const chain = spawn(getCLIPath(), cliArgs, { cwd, stripColors: true, env, disableCIDetection: s.disableCIDetection })
      .wait('Enter a name for the project')
      .sendLine(s.name)
      .wait('Initialize the project with the above configuration?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Choose your default editor:')
      .sendLine(s.editor)
      .wait("Choose the type of app that you're building")
      .sendLine(s.appType)
      .wait('What javascript framework are you using')
      .sendLine(s.framework)
      .wait('Source Directory Path:')
      .sendLine(s.srcDir)
      .wait('Distribution Directory Path:')
      .sendLine(s.distDir)
      .wait('Build Command:')
      .sendLine(s.buildCmd)
      .wait('Start Command:')
      .sendCarriageReturn();

    if (!providerConfigSpecified) {
      chain
        .wait('Using default provider  awscloudformation')
        .wait('Select the authentication method you want to use:')
        .sendCarriageReturn()
        .wait('Please choose the profile you want to use')
        .sendLine(s.profileName);
    }

    chain
      .wait('Help improve Amplify CLI by sharing non sensitive configurations on failures')
      .sendYes()
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
}

export function initAndroidProjectWithProfile(cwd: string, settings: Object): Promise<void> {
  const s = { ...defaultSettings, ...settings };

  addCITags(cwd);

  return new Promise((resolve, reject) => {
    spawn(getCLIPath(), ['init'], {
      cwd,
      stripColors: true,
      env: {
        CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
      },
    })
      .wait('Enter a name for the project')
      .sendLine(s.name)
      .wait('Initialize the project with the above configuration?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Choose your default editor:')
      .sendLine(s.editor)
      .wait("Choose the type of app that you're building")
      .sendLine('android')
      .wait('Where is your Res directory')
      .sendCarriageReturn()
      .wait('Select the authentication method you want to use:')
      .sendCarriageReturn()
      .wait('Please choose the profile you want to use')
      .sendLine(s.profileName)
      .wait('Help improve Amplify CLI by sharing non sensitive configurations on failures')
      .sendYes()
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (!err) {
          addCITags(cwd);

          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function createRandomName() {
  const length = 20;
  const regExp = new RegExp('-', 'g');
  return uuid().replace(regExp, '').substring(0, length);
}

export function initIosProjectWithProfile(cwd: string, settings: Object): Promise<void> {
  const s = { ...defaultSettings, ...settings };

  addCITags(cwd);

  return new Promise((resolve, reject) => {
    spawn(getCLIPath(), ['init'], {
      cwd,
      stripColors: true,
      env: {
        CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
      },
    })
      .wait('Enter a name for the project')
      .sendLine(s.name)
      .wait('Initialize the project with the above configuration?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Choose your default editor:')
      .sendLine(s.editor)
      .wait("Choose the type of app that you're building")
      .sendKeyDown(3)
      .sendCarriageReturn()
      .wait('Select the authentication method you want to use:')
      .sendCarriageReturn()
      .wait('Please choose the profile you want to use')
      .sendLine(s.profileName)
      .wait('Help improve Amplify CLI by sharing non sensitive configurations on failures')
      .sendYes()
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (!err) {
          addCITags(cwd);

          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function initFlutterProjectWithProfile(cwd: string, settings: Object): Promise<void> {
  const s = { ...defaultSettings, ...settings };

  addCITags(cwd);

  return new Promise((resolve, reject) => {
    const chain = spawn(getCLIPath(), ['init'], { cwd, stripColors: true })
      .wait('Enter a name for the project')
      .sendLine(s.name)
      .wait('Initialize the project with the above configuration?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Choose your default editor:')
      .sendLine(s.editor)
      .wait("Choose the type of app that you're building")
      .sendKeyDown(2)
      .sendCarriageReturn()
      .wait('Where do you want to store your configuration file')
      .sendLine('./lib/')
      .wait('Using default provider  awscloudformation')
      .wait('Select the authentication method you want to use:')
      .sendCarriageReturn()
      .wait('Please choose the profile you want to use')
      .sendLine(s.profileName);

    singleSelect(chain, s.region, amplifyRegions);
    chain
      .wait('Help improve Amplify CLI by sharing non sensitive configurations on failures')
      .sendYes()
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function initProjectWithAccessKey(
  cwd: string,
  settings: { accessKeyId: string; secretAccessKey: string; region?: string },
): Promise<void> {
  const s = { ...defaultSettings, ...settings };

  addCITags(cwd);

  return new Promise((resolve, reject) => {
    const chain = spawn(getCLIPath(), ['init'], {
      cwd,
      stripColors: true,
      env: {
        CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
      },
    })
      .wait('Enter a name for the project')
      .sendLine(s.name)
      .wait('Initialize the project with the above configuration?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Choose your default editor:')
      .sendLine(s.editor)
      .wait("Choose the type of app that you're building")
      .sendLine(s.appType)
      .wait('What javascript framework are you using')
      .sendLine(s.framework)
      .wait('Source Directory Path:')
      .sendLine(s.srcDir)
      .wait('Distribution Directory Path:')
      .sendLine(s.distDir)
      .wait('Build Command:')
      .sendLine(s.buildCmd)
      .wait('Start Command:')
      .sendCarriageReturn()
      .wait('Using default provider  awscloudformation')
      .wait('Select the authentication method you want to use:')
      .send(KEY_DOWN_ARROW)
      .sendCarriageReturn()
      .pauseRecording()
      .wait('accessKeyId')
      .sendLine(s.accessKeyId)
      .wait('secretAccessKey')
      .sendLine(s.secretAccessKey)
      .resumeRecording()
      .wait('region');

    singleSelect(chain, s.region, amplifyRegions);

    chain
      .wait('Help improve Amplify CLI by sharing non sensitive configurations on failures')
      .sendYes()
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function initNewEnvWithAccessKey(cwd: string, s: { envName: string; accessKeyId: string; secretAccessKey: string }): Promise<void> {
  addCITags(cwd);

  return new Promise((resolve, reject) => {
    const chain = spawn(getCLIPath(), ['init'], {
      cwd,
      stripColors: true,
      env: {
        CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
      },
    })
      .wait('Do you want to use an existing environment?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Using default provider  awscloudformation')
      .wait('Select the authentication method you want to use:')
      .send(KEY_DOWN_ARROW)
      .sendCarriageReturn()
      .pauseRecording()
      .wait('accessKeyId')
      .sendLine(s.accessKeyId)
      .wait('secretAccessKey')
      .sendLine(s.secretAccessKey)
      .resumeRecording()
      .wait('region');

    singleSelect(chain, process.env.CLI_REGION, amplifyRegions);

    chain.wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/).run((err: Error) => {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

export function initNewEnvWithProfile(cwd: string, s: { envName: string }): Promise<void> {
  addCITags(cwd);

  return new Promise((resolve, reject) => {
    spawn(getCLIPath(), ['init'], {
      cwd,
      stripColors: true,
      env: {
        CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
      },
    })
      .wait('Do you want to use an existing environment?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Using default provider  awscloudformation')
      .wait('Select the authentication method you want to use:')
      .sendCarriageReturn()
      .wait('Please choose the profile you want to use')
      .sendCarriageReturn()
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function updatedInitNewEnvWithProfile(cwd: string, s: { envName: string }): Promise<void> {
  addCITags(cwd);

  return new Promise((resolve, reject) => {
    spawn(getCLIPath(), ['init'], {
      cwd,
      stripColors: true,
    })
      .wait('Do you want to use an existing environment?')
      .sendConfirmNo()
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Choose your default editor:')
      .sendCarriageReturn()
      .wait('Using default provider  awscloudformation')
      .wait('Select the authentication method you want to use:')
      .sendCarriageReturn()
      .wait('Please choose the profile you want to use')
      .sendCarriageReturn()
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function amplifyInitSandbox(cwd: string, settings: {}): Promise<void> {
  const s = { ...defaultSettings, ...settings };
  let env;

  if (s.disableAmplifyAppCreation === true) {
    env = {
      CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
    };
  }

  addCITags(cwd);

  return new Promise((resolve, reject) => {
    spawn(getCLIPath(), ['init'], { cwd, stripColors: true, env })
      .wait('Enter a name for the environment')
      .sendLine(s.envName)
      .wait('Choose your default editor:')
      .sendLine(s.editor)
      .wait('Using default provider  awscloudformation')
      .wait('Select the authentication method you want to use:')
      .sendCarriageReturn()
      .wait('Please choose the profile you want to use')
      .sendLine(s.profileName)
      .wait(/Try "amplify add api" to create a backend API and then "amplify (push|publish)" to deploy everything/)
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function amplifyInitYes(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    spawn(getCLIPath(), ['init', '--yes'], {
      cwd,
      stripColors: true,
      env: {
        CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_CREATION: '1',
      },
    }).run((err: Error) =>
      err
        ? reject(err)
        : (() => {
            resolve();
          })(),
    );
  });
}

export function amplifyVersion(cwd: string, expectedVersion: string, testingWithLatestCodebase = false): Promise<void> {
  return new Promise((resolve, reject) => {
    spawn(getCLIPath(testingWithLatestCodebase), ['--version'], { cwd, stripColors: true })
      .wait(expectedVersion)
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

//Can be called only if detects teamprovider change
export function amplifyStatusWithMigrate(cwd: string, expectedStatus: string, testingWithLatestCodebase): Promise<void> {
  return new Promise((resolve, reject) => {
    let regex = new RegExp(`.*${expectedStatus}*`);
    spawn(getCLIPath(testingWithLatestCodebase), ['status'], { cwd, stripColors: true })
      .wait('Amplify has been upgraded to handle secrets more securely by migrating some values')
      .sendConfirmYes()
      .wait(regex)
      .sendCarriageReturn()
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function amplifyStatus(cwd: string, expectedStatus: string, testingWithLatestCodebase = false): Promise<void> {
  return new Promise((resolve, reject) => {
    let regex = new RegExp(`.*${expectedStatus}*`);
    spawn(getCLIPath(testingWithLatestCodebase), ['status'], { cwd, stripColors: true })
      .wait(regex)
      .sendCarriageReturn()
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

export function initCDKProject(cwd: string, templatePath: string): Promise<string> {
  return new Promise<void>((resolve, reject) => {
    spawn(getNpxPath(), ['cdk', 'init', 'app', '--language', 'typescript'], {
      cwd,
      stripColors: true,
      // npx cdk does not work on verdaccio
      env: {
        npm_config_registry: 'https://registry.npmjs.org/',
      },
    })
      .sendConfirmYes()
      .run((err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  })
    .then(() => {
      const binDir = path.join(cwd, 'bin');
      copySync(templatePath, binDir, { overwrite: true });
      moveSync(path.join(binDir, 'app.ts'), path.join(binDir, `${path.basename(cwd)}.ts`), { overwrite: true });
    })
    .then(
      () =>
        new Promise<void>((resolve, reject) => {
          // change to official package
          spawn('npm', ['install', '--save-dev', '@aws-amplify/graphql-construct-alpha'], { cwd, stripColors: true }).run((err: Error) => {
            if (!err) {
              resolve();
            } else {
              reject(err);
            }
          });
        }),
    )
    .then(
      () =>
        new Promise<void>((resolve, reject) => {
          // override dep version from cdk init
          spawn('npm', ['install', '--save', 'aws-cdk-lib@2.80.0'], { cwd, stripColors: true }).run((err: Error) => {
            if (!err) {
              resolve();
            } else {
              reject(err);
            }
          });
        }),
    )
    .then(() => readFile(path.join(cwd, 'package.json'), 'utf8'))
    .then((packageJson) => JSON.parse(packageJson).name.replace(/_/g, '-'));
}

export function cdkDeploy(cwd: string, option: string): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    spawn(getNpxPath(), ['cdk', 'deploy', '--outputs-file', 'outputs.json', option], {
      cwd,
      stripColors: true,
      // npx cdk does not work on verdaccio
      env: {
        npm_config_registry: 'https://registry.npmjs.org/',
      },
    }).run((err: Error) => {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  })
    .then(() => readFile(path.join(cwd, 'outputs.json'), 'utf8'))
    .then(JSON.parse);
}
