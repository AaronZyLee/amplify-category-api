import {
  amplifyPush,
  deleteProject,
  initJSProjectWithProfile,
  addApiWithoutSchema,
  updateApiSchema,
  updateApiWithMultiAuth,
  createNewProjectDir,
  deleteProjectDir,
  getAppSyncApi,
  getProjectMeta,
  getTransformConfig,
  getDDBTable,
  addFunction,
  getBackendAmplifyMeta,
  amplifyPushUpdateForDependentModel,
  amplifyPushForce,
  createRandomName,
  addV1RDSDataSource,
} from 'amplify-category-api-e2e-core';
import path from 'path';
import { existsSync } from 'fs';
import { TRANSFORM_CURRENT_VERSION } from 'graphql-transformer-core';

describe('amplify add api (GraphQL)', () => {
  let projRoot: string;
  let projFolderName: string;
  beforeEach(async () => {
    projFolderName = 'graphqlapi';
    projRoot = await createNewProjectDir(projFolderName);
  });

  afterEach(async () => {
    const metaFilePath = path.join(projRoot, 'amplify', '#current-cloud-backend', 'amplify-meta.json');
    if (existsSync(metaFilePath)) {
      await deleteProject(projRoot);
    }
    deleteProjectDir(projRoot);
  });

  it('init a project and add the simple_model api with multiple authorization providers', async () => {
    const appName = createRandomName();
    await initJSProjectWithProfile(projRoot, { name: appName });
    await addApiWithoutSchema(projRoot, { transformerVersion: 1 });
    await updateApiSchema(projRoot, appName, 'simple_model.graphql');
    await updateApiWithMultiAuth(projRoot, {});
    await amplifyPush(projRoot);

    const meta = getProjectMeta(projRoot);
    const { output } = meta.api[appName];
    const { GraphQLAPIIdOutput, GraphQLAPIEndpointOutput, GraphQLAPIKeyOutput } = output;
    const { graphqlApi } = await getAppSyncApi(GraphQLAPIIdOutput, meta.providers.awscloudformation.Region);

    expect(graphqlApi).toBeDefined();
    expect(graphqlApi.authenticationType).toEqual('API_KEY');
    expect(graphqlApi.additionalAuthenticationProviders).toHaveLength(3);
    expect(graphqlApi.additionalAuthenticationProviders).toHaveLength(3);

    const cognito = graphqlApi.additionalAuthenticationProviders.filter((a) => a.authenticationType === 'AMAZON_COGNITO_USER_POOLS')[0];

    expect(cognito).toBeDefined();
    expect(cognito.userPoolConfig).toBeDefined();

    const iam = graphqlApi.additionalAuthenticationProviders.filter((a) => a.authenticationType === 'AWS_IAM')[0];

    expect(iam).toBeDefined();

    const oidc = graphqlApi.additionalAuthenticationProviders.filter((a) => a.authenticationType === 'OPENID_CONNECT')[0];

    expect(oidc).toBeDefined();
    expect(oidc.openIDConnectConfig).toBeDefined();
    expect(oidc.openIDConnectConfig.issuer).toEqual('https://facebook.com/');
    expect(oidc.openIDConnectConfig.clientId).toEqual('clientId');
    expect(oidc.openIDConnectConfig.iatTTL).toEqual(1000);
    expect(oidc.openIDConnectConfig.authTTL).toEqual(2000);

    expect(GraphQLAPIIdOutput).toBeDefined();
    expect(GraphQLAPIEndpointOutput).toBeDefined();
    expect(GraphQLAPIKeyOutput).toBeDefined();

    expect(graphqlApi).toBeDefined();
    expect(graphqlApi.apiId).toEqual(GraphQLAPIIdOutput);
  });

  it('init a project and add v1 rds datasource', async () => {
    const appName = createRandomName();
    await initJSProjectWithProfile(projRoot, { name: appName });
    await addApiWithoutSchema(projRoot, { transformerVersion: 1 });
    await updateApiSchema(projRoot, appName, 'simple_model.graphql');
    await updateApiWithMultiAuth(projRoot, {});
    await amplifyPush(projRoot);

    const meta = getProjectMeta(projRoot);
    const { output } = meta.api[appName];
    const { GraphQLAPIIdOutput } = output;
    const { graphqlApi } = await getAppSyncApi(GraphQLAPIIdOutput, meta.providers.awscloudformation.Region);

    expect(graphqlApi).toBeDefined();
    expect(graphqlApi.apiId).toEqual(GraphQLAPIIdOutput);

    await expect(addV1RDSDataSource(projRoot)).resolves;
  });

  it('init a project and add the simple_model api, match transformer version to current version', async () => {
    const name = `simplemodelv${TRANSFORM_CURRENT_VERSION}`;
    await initJSProjectWithProfile(projRoot, { name });
    await addApiWithoutSchema(projRoot, { transformerVersion: 1 });
    await updateApiSchema(projRoot, name, 'simple_model.graphql');
    await amplifyPush(projRoot);

    const meta = getProjectMeta(projRoot);
    const { output } = meta.api[name];
    const { GraphQLAPIIdOutput, GraphQLAPIEndpointOutput, GraphQLAPIKeyOutput } = output;
    const { graphqlApi } = await getAppSyncApi(GraphQLAPIIdOutput, meta.providers.awscloudformation.Region);

    expect(GraphQLAPIIdOutput).toBeDefined();
    expect(GraphQLAPIEndpointOutput).toBeDefined();
    expect(GraphQLAPIKeyOutput).toBeDefined();

    expect(graphqlApi).toBeDefined();
    expect(graphqlApi.apiId).toEqual(GraphQLAPIIdOutput);

    const transformConfig = getTransformConfig(projRoot, name);
    expect(transformConfig).toBeDefined();
    expect(transformConfig.Version).toBeDefined();
    expect(transformConfig.Version).toEqual(TRANSFORM_CURRENT_VERSION);
  });

  it('inits a project with a simple model , add a function and removes the depedent @model', async () => {
    const random = Math.floor(Math.random() * 10000);
    const projectName = `blogapp`;
    const nextSchema = 'initial_key_blog.graphql';
    const initialSchema = 'two-model-schema.graphql';
    const fnName = `integtestfn${random}`;
    await initJSProjectWithProfile(projRoot, { name: projectName });
    await addApiWithoutSchema(projRoot, { transformerVersion: 1 });
    await updateApiSchema(projRoot, projectName, initialSchema);
    await addFunction(
      projRoot,
      {
        name: fnName,
        functionTemplate: 'Hello World',
        additionalPermissions: {
          permissions: ['storage'],
          choices: ['api', 'storage'],
          resources: ['Comment:@model(appsync)'],
          resourceChoices: ['Post:@model(appsync)', 'Comment:@model(appsync)'],
          operations: ['read'],
        },
      },
      'nodejs',
    );
    await amplifyPush(projRoot);
    updateApiSchema(projRoot, projectName, nextSchema);
    await amplifyPushUpdateForDependentModel(projRoot, undefined, true);
    const meta = getProjectMeta(projRoot);
    const region = meta.providers.awscloudformation.Region;
    const { output } = meta.api.blogapp;
    const { GraphQLAPIIdOutput, GraphQLAPIEndpointOutput, GraphQLAPIKeyOutput } = output;

    expect(GraphQLAPIIdOutput).toBeDefined();
    expect(GraphQLAPIEndpointOutput).toBeDefined();
    expect(GraphQLAPIKeyOutput).toBeDefined();

    const { graphqlApi } = await getAppSyncApi(GraphQLAPIIdOutput, region);

    expect(graphqlApi).toBeDefined();
    expect(graphqlApi.apiId).toEqual(GraphQLAPIIdOutput);
    const tableName = `Comment-${GraphQLAPIIdOutput}-integtest`;
    const error = { message: null };
    try {
      const table = await getDDBTable(tableName, region);
      expect(table).toBeUndefined();
    } catch (ex) {
      Object.assign(error, ex);
    }
    expect(error).toBeDefined();
    expect(error.message).toContain(`${tableName} not found`);
  });

  it('api force push with no changes', async () => {
    const projectName = `apinochange`;
    await initJSProjectWithProfile(projRoot, { name: projectName });
    await addApiWithoutSchema(projRoot, { transformerVersion: 1 });
    await updateApiSchema(projRoot, projectName, 'two-model-schema.graphql');
    await amplifyPush(projRoot);
    let meta = getBackendAmplifyMeta(projRoot);
    const { lastPushDirHash: beforeDirHash } = meta.api[projectName];
    await amplifyPushForce(projRoot);
    meta = getBackendAmplifyMeta(projRoot);
    const { lastPushDirHash: afterDirHash } = meta.api[projectName];
    expect(beforeDirHash).toBe(afterDirHash);
  });
});
