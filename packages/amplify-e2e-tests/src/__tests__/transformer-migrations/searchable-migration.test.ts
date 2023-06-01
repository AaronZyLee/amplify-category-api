import {
  initJSProjectWithProfile,
  deleteProject,
  amplifyPush,
  amplifyPushUpdate,
  addFeatureFlag,
  createRandomName,
  addAuthWithDefault,
} from 'amplify-category-api-e2e-core';
import { addApiWithoutSchema, updateApiSchema, getProjectMeta } from 'amplify-category-api-e2e-core';
import { createNewProjectDir, deleteProjectDir } from 'amplify-category-api-e2e-core';
import gql from 'graphql-tag';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
(global as any).fetch = require('node-fetch');
import { STS } from 'aws-sdk';

jest.setTimeout(120 * 60 * 1000); // Set timeout to 2 hour because of creating/deleting searchable instance

describe('transformer model searchable migration test', () => {
  let projRoot: string;
  let projectName: string;
  let appSyncClient = undefined;
  let currentTimestamp = new Date().getTime();
  console.log(`started test at: ${currentTimestamp}`);

  beforeEach(async () => {
    projectName = createRandomName();
    projRoot = await createNewProjectDir(createRandomName());
    await initJSProjectWithProfile(projRoot, {
      name: projectName,
    });
    await addAuthWithDefault(projRoot, {});
    currentTimestamp = new Date().getTime();
    console.log(`time after before block: ${currentTimestamp}`);
  });

  afterEach(async () => {
    currentTimestamp = new Date().getTime();
    console.log(`time before after block: ${currentTimestamp}`);
    await deleteProject(projRoot);
    deleteProjectDir(projRoot);
    currentTimestamp = new Date().getTime();
    console.log(`time after after block: ${currentTimestamp}`);
  });

  it('migration of searchable directive - search should return expected results', async () => {
    currentTimestamp = new Date().getTime();
    console.log(`time before test block: ${currentTimestamp}`);
    const v1Schema = 'transformer_migration/searchable-v1.graphql';
    const v2Schema = 'transformer_migration/searchable-v2.graphql';

    await addApiWithoutSchema(projRoot, { apiName: projectName, transformerVersion: 1 });
    await updateApiSchema(projRoot, projectName, v1Schema);
    currentTimestamp = new Date().getTime();
    console.log(`time before first push: ${currentTimestamp}`);
    await amplifyPush(projRoot);
    currentTimestamp = new Date().getTime();
    console.log(`time after first push: ${currentTimestamp}`);
    await refreshCredentials();

    appSyncClient = getAppSyncClientFromProj(projRoot);
    await runAndValidateQuery('test1', 'test1', 10);

    await addFeatureFlag(projRoot, 'graphqltransformer', 'transformerVersion', 2);
    await addFeatureFlag(projRoot, 'graphqltransformer', 'useExperimentalPipelinedTransformer', true);

    await updateApiSchema(projRoot, projectName, v2Schema);
    currentTimestamp = new Date().getTime();
    console.log(`time before second push: ${currentTimestamp}`);
    await amplifyPushUpdate(projRoot);

    appSyncClient = getAppSyncClientFromProj(projRoot);
    await runAndValidateQuery('test2', 'test2', 10);
    currentTimestamp = new Date().getTime();
    console.log(`time after test block: ${currentTimestamp}`);
  });

  const getAppSyncClientFromProj = (projRoot: string) => {
    const meta = getProjectMeta(projRoot);
    const region = meta['providers']['awscloudformation']['Region'] as string;
    const { output } = meta.api[projectName];
    const url = output.GraphQLAPIEndpointOutput as string;
    const apiKey = output.GraphQLAPIKeyOutput as string;

    return new AWSAppSyncClient({
      url,
      region,
      disableOffline: true,
      auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey,
      },
    });
  };

  const fragments = [`fragment FullTodo on Todo { id name description count }`];

  const runMutation = async (query: string) => {
    try {
      const q = [query, ...fragments].join('\n');
      const response = await appSyncClient.mutate({
        mutation: gql(q),
        fetchPolicy: 'no-cache',
      });
      return response;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const createEntry = async (name: string, description: string, count: number) => {
    return await runMutation(getCreateTodosMutation(name, description, count));
  };

  function getCreateTodosMutation(name: string, description: string, count: number): string {
    return `mutation {
          createTodo(input: {
              name: "${name}"
              description: "${description}"
              count: ${count}
          }) { ...FullTodo }
      }`;
  }

  const runAndValidateQuery = async (name: string, description: string, count: number) => {
    const response = await createEntry(name, description, count);
    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data.createTodo).toBeDefined();
  };
});

const refreshCredentials = async () => {
  const testRole = process.env.TEST_ACCOUNT_ROLE;
  console.log(`Test account role from test: ${testRole}`);

  try {
    console.log(`before reset env vars: ${areEnvVarsSet()}`);
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_SESSION_TOKEN;

    console.log(`after reset env vars: ${areEnvVarsSet()}`);

    const sts = new STS({
      apiVersion: '2011-06-15'
    });
    const testAccountIdentity = await sts.getCallerIdentity().promise();
    console.log(`Using Test role identity: ${JSON.stringify(testAccountIdentity)}`);

    const assumeRoleRes = await sts.assumeRole({
      RoleArn: testRole,
      RoleSessionName: `testSession12249`,
      // One hour
      DurationSeconds: 1 * 60 * 60,
    }).promise();

    process.env['AWS_ACCESS_KEY_ID'] = assumeRoleRes.Credentials.AccessKeyId;
    process.env['AWS_SECRET_ACCESS_KEY'] = assumeRoleRes.Credentials.SecretAccessKey;
    process.env['AWS_SESSION_TOKEN'] = assumeRoleRes.Credentials.SessionToken;

    console.log(`after refresh env vars: ${areEnvVarsSet()}`);
  }
  catch(err) {
    console.log(err);
  }
}

const areEnvVarsSet = () => {
  const envVars = {
    acskey: process.env.AWS_ACCESS_KEY_ID,
    seckey: process.env.AWS_SECRET_ACCESS_KEY,
    sess: process.env.AWS_SESSION_TOKEN
  };
  if (envVars?.acskey && envVars?.seckey && envVars?.sess) {
    return true;
  }
  else {
    return false;
  }
}
