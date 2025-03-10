import * as cdk from 'aws-cdk-lib';
import {
  $TSContext,
  AmplifyCategories,
  AmplifyError,
  buildOverrideDir,
  getAmplifyResourceByCategories,
  JSONUtilities,
  PathConstants,
  pathManager,
  stateManager,
  Template,
  writeCFNTemplate,
} from '@aws-amplify/amplify-cli-core';
import { formatter, printer } from '@aws-amplify/amplify-prompts';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vm from 'vm2';
import { AmplifyApigwResourceStack, ApigwInputs, CrudOperation, Path } from '.';
import { ApigwInputState } from '../apigw-input-state';
import { ADMIN_QUERIES_NAME } from '../../../category-constants';
export class ApigwStackTransform {
  cliInputs: ApigwInputs;
  resourceTemplateObj: AmplifyApigwResourceStack | undefined;
  cliInputsState: ApigwInputState;
  cfn: Template;
  cfnInputParams: Record<string, any>;
  resourceName: string;
  private _app: cdk.App;

  constructor(context: $TSContext, resourceName: string, cliInputState?: ApigwInputState) {
    this._app = new cdk.App();
    this.resourceName = resourceName;

    // Validate the cli-inputs.json for the resource
    this.cliInputsState = cliInputState ?? new ApigwInputState(context, resourceName);
    this.cliInputs = this.cliInputsState.getCliInputPayload();
    void this.cliInputsState.isCLIInputsValid();
  }

  async transform() {
    let authResourceName: string;

    const pathsWithUserPoolGroups = Object.entries(this.cliInputs.paths).filter(([_, path]) => !!path?.permissions?.groups);

    if (this.resourceName === ADMIN_QUERIES_NAME || pathsWithUserPoolGroups.length > 0) {
      [authResourceName] = getAmplifyResourceByCategories(AmplifyCategories.AUTH).filter(
        (resourceName) => resourceName !== 'userPoolGroups',
      );
    }

    // Generate cloudformation stack from cli-inputs.json
    this.generateStack(authResourceName, pathsWithUserPoolGroups);

    // Modify cloudformation files based on overrides
    await this.applyOverrides();
    // Generate cloudformation stack input params from cli-inputs.json
    this.generateCfnInputParameters();

    // Save generated cloudformation.json and parameters.json files
    await this.saveBuildFiles();
  }

  generateCfnInputParameters() {
    this.cfnInputParams = this.resourceTemplateObj.getCfnParameterValues();
  }

  generateStack(authResourceName?: string, pathsWithUserPoolGroups: [string, Path][] = []) {
    this.resourceTemplateObj = new AmplifyApigwResourceStack(this._app, 'AmplifyApigwResourceStack', this.cliInputs);

    if (authResourceName) {
      const authRoleLogicalId = `auth${authResourceName}UserPoolId`;
      this.resourceTemplateObj.addCfnParameter(
        {
          type: 'String',
          default: authRoleLogicalId,
        },
        authRoleLogicalId,
      );

      const uniqueUserPoolGroupsList = new Set<string>();
      for (const [pathName, path] of pathsWithUserPoolGroups) {
        for (const [groupName, crudOps] of Object.entries(path.permissions.groups)) {
          uniqueUserPoolGroupsList.add(groupName);
          this.resourceTemplateObj.addIamPolicyResourceForUserPoolGroup(
            this.resourceName,
            authRoleLogicalId,
            groupName,
            pathName,
            convertCrudOperationsToCfnPermissions(crudOps),
          );
        }
      }
      Array.from(uniqueUserPoolGroupsList).forEach((userPoolGroupName) => {
        this.resourceTemplateObj.addCfnParameter(
          {
            type: 'String',
            default: `authuserPoolGroups${userPoolGroupName}GroupRole`,
          },
          `authuserPoolGroups${userPoolGroupName}GroupRole`,
        );
      });
    }

    // Add Parameters
    const addedFunctions = new Set();
    for (const path of Object.values(this.cliInputs.paths)) {
      if (!addedFunctions.has(path.lambdaFunction)) {
        addedFunctions.add(path.lambdaFunction);
        this.resourceTemplateObj.addCfnParameter(
          {
            type: 'String',
            default: `function${path.lambdaFunction}Name`,
          },
          `function${path.lambdaFunction}Name`,
        );
        this.resourceTemplateObj.addCfnParameter(
          {
            type: 'String',
            default: `function${path.lambdaFunction}Arn`,
          },
          `function${path.lambdaFunction}Arn`,
        );
      }
    }

    this.resourceTemplateObj.addCfnParameter(
      {
        type: 'String',
      },
      'env',
    );

    // Add conditions
    this.resourceTemplateObj.addCfnCondition(
      {
        expression: cdk.Fn.conditionEquals(cdk.Fn.ref('env'), 'NONE'),
      },
      'ShouldNotCreateEnvResources',
    );

    // Add outputs
    this.resourceTemplateObj.addCfnOutput(
      {
        value: cdk.Fn.join('', [
          'https://',
          cdk.Fn.ref(this.cliInputsState.resourceName),
          '.execute-api.',
          cdk.Fn.ref('AWS::Region'),
          '.amazonaws.com/',
          cdk.Fn.conditionIf('ShouldNotCreateEnvResources', 'Prod', cdk.Fn.ref('env')) as unknown as string,
        ]),
        description: 'Root URL of the API gateway',
      },
      'RootUrl',
    );

    this.resourceTemplateObj.addCfnOutput(
      {
        value: this.resourceName,
        description: 'API Friendly name',
      },
      'ApiName',
    );

    this.resourceTemplateObj.addCfnOutput(
      {
        value: cdk.Fn.ref(this.resourceName),
        description: 'API ID (prefix of API URL)',
      },
      'ApiId',
    );

    // Add resources
    this.resourceName === ADMIN_QUERIES_NAME
      ? this.resourceTemplateObj.generateAdminQueriesStack(this.resourceName, authResourceName)
      : this.resourceTemplateObj.generateStackResources(this.resourceName);
  }

  async applyOverrides() {
    const backendDir = pathManager.getBackendDirPath();
    const overrideFilePath = pathManager.getResourceDirectoryPath(undefined, AmplifyCategories.API, this.resourceName);
    const overrideJSFilePath = path.join(overrideFilePath, 'build', 'override.js');

    const isBuild = await buildOverrideDir(backendDir, overrideFilePath);

    // skip if packageManager or override.ts not found
    if (isBuild) {
      let override;
      try {
        ({ override } = await import(overrideJSFilePath));
      } catch {
        formatter.list(['No override file found', `To override ${this.resourceName} run "amplify override api"`]);
        override = undefined;
      }

      if (override && typeof override === 'function') {
        let overrideCode: string;
        try {
          overrideCode = await fs.readFile(overrideJSFilePath, 'utf-8');
        } catch (error) {
          formatter.list(['No override file found', `To override ${this.resourceName} run amplify override api`]);
          return;
        }

        const sandboxNode = new vm.NodeVM({
          console: 'inherit',
          timeout: 5000,
          sandbox: {},
          require: {
            context: 'sandbox',
            builtin: ['path'],
            external: true,
          },
        });
        const { envName } = stateManager.getLocalEnvInfo();
        const { projectName } = stateManager.getProjectConfig();
        const projectInfo = {
          envName,
          projectName,
        };
        try {
          await sandboxNode
            .run(overrideCode, overrideJSFilePath)
            .override(this.resourceTemplateObj as AmplifyApigwResourceStack, projectInfo);
        } catch (err) {
          throw new AmplifyError(
            'InvalidOverrideError',
            {
              message: 'Executing overrides failed.',
              details: err.message,
              resolution: 'There may be runtime errors in your overrides file. If so, fix the errors and try again.',
            },
            err,
          );
        }
      }
    }
  }

  private async saveBuildFiles() {
    if (this.resourceTemplateObj) {
      this.cfn = JSONUtilities.parse(this.resourceTemplateObj.renderCloudFormationTemplate());
    }

    const resourceDirPath = pathManager.getResourceDirectoryPath(undefined, AmplifyCategories.API, this.resourceName);
    fs.ensureDirSync(resourceDirPath);

    const buildDirPath = path.join(resourceDirPath, PathConstants.BuildDirName);
    fs.ensureDirSync(buildDirPath);

    stateManager.setResourceParametersJson(undefined, AmplifyCategories.API, this.resourceName, this.cfnInputParams);

    const cfnFilePath = path.resolve(path.join(buildDirPath, `${this.resourceName}-cloudformation-template.json`));
    return writeCFNTemplate(this.cfn, cfnFilePath);
  }
}

function convertCrudOperationsToCfnPermissions(crudOps: CrudOperation[]) {
  const opMap: Record<CrudOperation, string[]> = {
    [CrudOperation.CREATE]: ['/POST'],
    [CrudOperation.READ]: ['/GET'],
    [CrudOperation.UPDATE]: ['/PUT', '/PATCH'],
    [CrudOperation.DELETE]: ['/DELETE'],
  };
  return crudOps.flatMap((op) => opMap[op]);
}
