import { nspawn as spawn, retry, getCLIPath, describeCloudFormationStack } from '..';
import { getBackendAmplifyMeta } from '../utils';

export const deleteProject = async (cwd: string, profileConfig?: any, usingLatestCodebase = false): Promise<void> => {
  // Read the meta from backend otherwise it could fail on non-pushed, just initialized projects
  const { StackName: stackName, Region: region } = getBackendAmplifyMeta(cwd).providers.awscloudformation;
  const sdkCreds = {
    accessKeyId: profileConfig?.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: profileConfig?.AWS_SECRET_ACCESS_KEY || '',
    sessionToken: profileConfig?.AWS_SESSION_TOKEN || ''
  };
  await retry(
    () => describeCloudFormationStack(stackName, region, sdkCreds),
    stack => stack.StackStatus.endsWith('_COMPLETE') || stack.StackStatus.endsWith('_FAILED'),
  );
  const noOutputTimeout = 1000 * 60 * 20; // 20 minutes;
  console.log('before cli delete cmd');
  return spawn(getCLIPath(usingLatestCodebase), ['delete', '--debug'], { cwd, stripColors: true, noOutputTimeout })
    .wait('Are you sure you want to continue?')
    .sendConfirmYes()
    .wait('Project deleted locally.')
    .runAsync();
};
