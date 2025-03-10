## API Report File for "@aws-amplify/graphql-transformer-core"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AmplifyApiGraphQlResourceStackTemplate } from '@aws-amplify/graphql-transformer-interfaces';
import { APIIAMResourceProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { ApiKeyConfig } from 'aws-cdk-lib/aws-appsync';
import { App } from 'aws-cdk-lib';
import { AppSyncAuthConfiguration } from '@aws-amplify/graphql-transformer-interfaces';
import { AppSyncDataSourceType } from '@aws-amplify/graphql-transformer-interfaces';
import { AppSyncFunctionConfigurationProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { AuthorizationConfig } from 'aws-cdk-lib/aws-appsync';
import { AuthorizationType } from 'aws-cdk-lib/aws-appsync';
import * as cdk from 'aws-cdk-lib';
import { CfnApiKey } from 'aws-cdk-lib/aws-appsync';
import { CfnElement } from 'aws-cdk-lib';
import { CfnGraphQLSchema } from 'aws-cdk-lib/aws-appsync';
import { CfnParameter } from 'aws-cdk-lib';
import { CfnParameterProps } from 'aws-cdk-lib';
import { CfnResource } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DataSourceInstance } from '@aws-amplify/graphql-transformer-interfaces';
import { DataSourceProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { DeploymentResources } from '@aws-amplify/graphql-transformer-interfaces';
import { DirectiveDefinitionNode } from 'graphql';
import { DirectiveNode } from 'graphql';
import { DocumentNode } from 'graphql/language';
import { DocumentNode as DocumentNode_2 } from 'graphql';
import { EnumTypeDefinitionNode } from 'graphql';
import { EnumTypeExtensionNode } from 'graphql';
import { FieldDefinitionNode } from 'graphql';
import { FieldNode } from 'graphql';
import { Grant } from 'aws-cdk-lib/aws-iam';
import { GraphqlApiBase } from 'aws-cdk-lib/aws-appsync';
import { GraphQLAPIProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { GraphQLError } from 'graphql';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { InlineMappingTemplateProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { InputObjectTypeDefinitionNode } from 'graphql';
import { InputObjectTypeExtensionNode } from 'graphql';
import { InputValueDefinitionNode } from 'graphql';
import { InterfaceTypeDefinitionNode } from 'graphql';
import { InterfaceTypeExtensionNode } from 'graphql';
import { IStackSynthesizer } from 'aws-cdk-lib';
import { ISynthesisSession } from 'aws-cdk-lib';
import { Location as Location_2 } from 'graphql';
import { LogConfig } from 'aws-cdk-lib/aws-appsync';
import { MappingTemplateProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { ModelFieldMap } from '@aws-amplify/graphql-transformer-interfaces';
import { MutationFieldType } from '@aws-amplify/graphql-transformer-interfaces';
import { NamedTypeNode } from 'graphql';
import { NestedStackProps } from 'aws-cdk-lib';
import { ObjectTypeDefinitionNode } from 'graphql';
import { ObjectTypeExtensionNode } from 'graphql';
import { QueryFieldType } from '@aws-amplify/graphql-transformer-interfaces';
import { S3MappingTemplateProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { SchemaDefinitionNode } from 'graphql';
import { Stack } from 'aws-cdk-lib';
import { StackManagerProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { StringValueNode } from 'graphql';
import { SubscriptionFieldType } from '@aws-amplify/graphql-transformer-interfaces';
import { Template } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerAuthProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerContextMetadataProvider } from '@aws-amplify/graphql-transformer-interfaces/src/transformer-context/transformer-context-provider';
import { TransformerContextOutputProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerContextProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerDataSourceManagerProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerLog } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerModelEnhancementProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerModelProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerPluginProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerPluginType } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerProviderRegistry } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerResolverProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerResolversManagerProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerResourceHelperProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerSchemaVisitStepContextProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerSecrets } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformerTransformSchemaStepContextProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { TransformHostProvider } from '@aws-amplify/graphql-transformer-interfaces';
import type { TransformParameters } from '@aws-amplify/graphql-transformer-interfaces';
import { TypeDefinitionNode } from 'graphql';
import { TypeNode } from 'graphql';
import { TypeSystemDefinitionNode } from 'graphql';
import { UnionTypeDefinitionNode } from 'graphql';
import { UnionTypeExtensionNode } from 'graphql';

// @public (undocumented)
export const APICategory = "api";

// @public (undocumented)
export function collectDirectives(sdl: string): DirectiveNode[];

// @public (undocumented)
export function collectDirectivesByTypeNames(sdl: string): {
    types: Record<string, string[]>;
    directives: string[];
};

// @public (undocumented)
export type ConflictDetectionType = 'VERSION' | 'NONE';

// @public (undocumented)
export const enum ConflictHandlerType {
    // (undocumented)
    AUTOMERGE = "AUTOMERGE",
    // (undocumented)
    LAMBDA = "LAMBDA",
    // (undocumented)
    OPTIMISTIC = "OPTIMISTIC_CONCURRENCY"
}

// @public (undocumented)
function createSyncLambdaIAMPolicy(context: TransformerContextProvider, stack: cdk.Stack, name: string, region?: string): iam.Policy;

// Warning: (ae-forgotten-export) The symbol "TransformerContext" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
function createSyncTable(context: TransformerContext): void;

// @public (undocumented)
export interface DatasourceType {
    // (undocumented)
    dbType: DBType;
    // (undocumented)
    provisionDB: boolean;
}

// @public (undocumented)
export type DBType = 'MySQL' | 'DDB';

// @public (undocumented)
export const DDB_DB_TYPE = "DDB";

// @public (undocumented)
export class DirectiveWrapper {
    constructor(node: DirectiveNode);
    // (undocumented)
    getArguments: <T>(defaultValue: Required<T>, options?: GetArgumentsOptions) => Required<T>;
    // (undocumented)
    serialize: () => DirectiveNode;
}

// @public (undocumented)
export class EnumWrapper {
    constructor(node: EnumTypeDefinitionNode);
    // (undocumented)
    addValue: (value: string) => void;
    // (undocumented)
    static create: (name: string, values?: string[]) => EnumWrapper;
    // (undocumented)
    directives: DirectiveWrapper[];
    // (undocumented)
    readonly name: string;
    // (undocumented)
    serialize: () => EnumTypeDefinitionNode;
    // (undocumented)
    values: string[];
}

// Warning: (ae-forgotten-export) The symbol "GenericFieldWrapper" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export class FieldWrapper extends GenericFieldWrapper {
    constructor(field: FieldDefinitionNode);
    // (undocumented)
    readonly argumenets?: InputValueDefinitionNode[];
    // (undocumented)
    static create: (name: string, type: string, isNullable?: boolean, isList?: boolean) => FieldWrapper;
    // (undocumented)
    readonly description?: StringValueNode;
    // (undocumented)
    readonly loc?: Location_2;
    // (undocumented)
    serialize: () => FieldDefinitionNode;
}

// @public (undocumented)
export const generateGetArgumentsInput: ({ shouldDeepMergeDirectiveConfigDefaults }: TransformParameters) => GetArgumentsOptions;

// @public (undocumented)
export const getAppSyncServiceExtraDirectives: () => string;

// @public (undocumented)
export type GetArgumentsOptions = {
    deepMergeArguments?: boolean;
};

// Warning: (ae-forgotten-export) The symbol "Operation" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export const getFieldNameFor: (op: Operation, typeName: string) => string;

// @public (undocumented)
export const getKeySchema: (table: any, indexName?: string) => any;

// @public (undocumented)
export const getParameterStoreSecretPath: (secret: string, secretsKey: string, apiName: string, environmentName: string, appId: string) => string;

// @public (undocumented)
export const getSortKeyFieldNames: (type: ObjectTypeDefinitionNode) => string[];

// @public (undocumented)
function getSyncConfig(ctx: TransformerTransformSchemaStepContextProvider, typeName: string): SyncConfig | undefined;

// @public (undocumented)
export const getTable: (ctx: TransformerContextProvider, object: ObjectTypeDefinitionNode) => any;

// @public (undocumented)
export class GraphQLTransform {
    constructor(options: GraphQLTransformOptions);
    // Warning: (ae-forgotten-export) The symbol "TransformerOutput" needs to be exported by the entry point index.d.ts
    // Warning: (ae-forgotten-export) The symbol "GraphQLApi" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    protected generateGraphQlApi(stackManager: StackManager, output: TransformerOutput): GraphQLApi;
    // (undocumented)
    getLogs(): TransformerLog[];
    // (undocumented)
    preProcessSchema(schema: DocumentNode): DocumentNode;
    // Warning: (ae-forgotten-export) The symbol "DatasourceTransformationConfig" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    transform(schema: string, datasourceConfig?: DatasourceTransformationConfig): DeploymentResources;
}

// @public (undocumented)
export interface GraphQLTransformOptions {
    // (undocumented)
    readonly authConfig?: AppSyncAuthConfiguration;
    // (undocumented)
    readonly host?: TransformHostProvider;
    // (undocumented)
    readonly overrideConfig?: OverrideConfig;
    // (undocumented)
    readonly resolverConfig?: ResolverConfig;
    // Warning: (ae-forgotten-export) The symbol "StackMapping" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    readonly stackMapping?: StackMapping;
    // (undocumented)
    readonly stacks?: Record<string, Template>;
    // (undocumented)
    readonly transformers: TransformerPluginProvider[];
    // (undocumented)
    readonly transformParameters?: Partial<TransformParameters>;
    // (undocumented)
    readonly userDefinedSlots?: Record<string, UserDefinedSlot[]>;
}

// @public (undocumented)
export const IAM_AUTH_ROLE_PARAMETER = "authRoleName";

// @public (undocumented)
export const IAM_UNAUTH_ROLE_PARAMETER = "unauthRoleName";

// @public (undocumented)
export type ImportAppSyncAPIInputs = {
    apiName: string;
    dataSourceConfig?: ImportedDataSourceConfig;
};

// @public (undocumented)
export type ImportedDataSourceConfig = RDSDataSourceConfig;

// @public (undocumented)
export type ImportedDataSourceType = ImportedRDSType;

// @public (undocumented)
export enum ImportedRDSType {
    // (undocumented)
    MYSQL = "mysql",
    // (undocumented)
    POSTGRESQL = "postgresql"
}

// @public (undocumented)
export class InputFieldWrapper extends GenericFieldWrapper {
    constructor(field: InputValueDefinitionNode);
    // (undocumented)
    readonly argumenets?: InputValueDefinitionNode[];
    // (undocumented)
    static create: (name: string, type: string, isNullable?: boolean, isList?: boolean) => InputFieldWrapper;
    // (undocumented)
    readonly description?: StringValueNode;
    // (undocumented)
    protected field: InputValueDefinitionNode;
    // (undocumented)
    static fromField: (name: string, field: FieldDefinitionNode, parent: ObjectTypeDefinitionNode, document: DocumentNode_2) => InputFieldWrapper;
    // (undocumented)
    readonly loc?: Location_2;
    // (undocumented)
    readonly name: string;
    // (undocumented)
    serialize: () => InputValueDefinitionNode;
    // (undocumented)
    type: TypeNode;
}

// @public (undocumented)
export class InputObjectDefinitionWrapper {
    constructor(node: InputObjectTypeDefinitionNode);
    // (undocumented)
    addField: (field: InputFieldWrapper) => void;
    // (undocumented)
    static create: (name: string, fields?: InputValueDefinitionNode[], directives?: DirectiveNode[]) => InputObjectDefinitionWrapper;
    // (undocumented)
    readonly directives?: DirectiveWrapper[];
    // (undocumented)
    readonly fields: InputFieldWrapper[];
    // (undocumented)
    static fromObject: (name: string, def: ObjectTypeDefinitionNode, document: DocumentNode_2) => InputObjectDefinitionWrapper;
    // (undocumented)
    getField: (name: string) => InputFieldWrapper;
    // (undocumented)
    hasField: (name: string) => boolean;
    // (undocumented)
    readonly name: string;
    // (undocumented)
    removeField: (field: InputFieldWrapper) => void;
    // (undocumented)
    serialize: () => InputObjectTypeDefinitionNode;
}

// @public (undocumented)
export class InvalidDirectiveError extends Error {
    constructor(message: string);
}

// @public (undocumented)
export class InvalidMigrationError extends Error {
    constructor(message: string, causedBy: string, fix: string);
    // (undocumented)
    causedBy: string;
    // (undocumented)
    fix: string;
}

// @public (undocumented)
export class InvalidTransformerError extends Error {
    constructor(message: string);
}

// @public (undocumented)
function isLambdaSyncConfig(syncConfig: SyncConfig): syncConfig is SyncConfigLambda;

// @public (undocumented)
export class MappingTemplate {
    // Warning: (ae-forgotten-export) The symbol "InlineTemplate" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    static inlineTemplateFromString(template: string): InlineTemplate;
    // Warning: (ae-forgotten-export) The symbol "S3MappingTemplate" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    static s3MappingTemplateFromString(template: string, templateName: string): S3MappingTemplate;
}

// @public (undocumented)
export const MYSQL_DB_TYPE = "MySQL";

// @public (undocumented)
export class ObjectDefinitionWrapper {
    constructor(node: ObjectTypeDefinitionNode);
    // (undocumented)
    addField: (field: FieldWrapper) => void;
    // (undocumented)
    static create: (name: string, fields?: FieldDefinitionNode[], directives?: DirectiveNode[]) => ObjectDefinitionWrapper;
    // (undocumented)
    readonly directives?: DirectiveWrapper[];
    // (undocumented)
    readonly fields: FieldWrapper[];
    // (undocumented)
    getField: (name: string) => FieldWrapper;
    // (undocumented)
    hasField: (name: string) => boolean;
    // (undocumented)
    readonly name: string;
    // (undocumented)
    removeField: (field: FieldWrapper) => void;
    // (undocumented)
    serialize: () => ObjectTypeDefinitionNode;
}

// @public (undocumented)
export type OverrideConfig = {
    overrideFlag: boolean;
    applyOverride: (stackManager: StackManager) => AmplifyApiGraphQlResourceStackTemplate;
};

// @public (undocumented)
export const RDS_SCHEMA_FILE_NAME = "schema.rds.graphql";

// @public (undocumented)
export type RDSConnectionSecrets = TransformerSecrets & {
    username: string;
    password: string;
    host: string;
    database: string;
    port: number;
};

// @public (undocumented)
export type RDSDataSourceConfig = RDSConnectionSecrets & {
    engine: ImportedRDSType;
};

// @public (undocumented)
export type ResolverConfig = {
    project?: SyncConfig;
    models?: Record<string, SyncConfig>;
};

// @public (undocumented)
export class SchemaValidationError extends Error {
    constructor(errors: Readonly<GraphQLError[]>);
}

// @public (undocumented)
export class StackManager implements StackManagerProvider {
    // Warning: (ae-forgotten-export) The symbol "ResourceToStackMap" needs to be exported by the entry point index.d.ts
    constructor(app: App, resourceMapping: ResourceToStackMap);
    // (undocumented)
    addParameter: (name: string, props: CfnParameterProps) => CfnParameter;
    // (undocumented)
    createStack: (stackName: string) => Stack;
    // (undocumented)
    getCloudFormationTemplates: () => Map<string, Template>;
    // (undocumented)
    getMappingTemplates: () => Map<string, string>;
    // (undocumented)
    getParameter: (name: string) => CfnParameter | void;
    // (undocumented)
    getStack: (stackName: string) => Stack;
    // (undocumented)
    getStackFor: (resourceId: string, defaultStackName?: string) => Stack;
    // (undocumented)
    hasStack: (stackName: string) => boolean;
    // Warning: (ae-forgotten-export) The symbol "TransformerRootStack" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    readonly rootStack: TransformerRootStack;
}

// @public (undocumented)
export type SyncConfig = SyncConfigOptimistic | SyncConfigServer | SyncConfigLambda;

// @public (undocumented)
export type SyncConfigLambda = {
    ConflictDetection: ConflictDetectionType;
    ConflictHandler: ConflictHandlerType.LAMBDA;
    LambdaConflictHandler: LambdaConflictHandler;
};

// @public (undocumented)
export type SyncConfigOptimistic = {
    ConflictDetection: ConflictDetectionType;
    ConflictHandler: ConflictHandlerType.OPTIMISTIC;
};

// @public (undocumented)
export type SyncConfigServer = {
    ConflictDetection: ConflictDetectionType;
    ConflictHandler: ConflictHandlerType.AUTOMERGE;
};

// Warning: (ae-forgotten-export) The symbol "DeltaSyncConfig" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
function syncDataSourceConfig(): DeltaSyncConfig;

declare namespace SyncUtils {
    export {
        createSyncTable,
        syncDataSourceConfig,
        validateResolverConfigForType,
        getSyncConfig,
        isLambdaSyncConfig,
        createSyncLambdaIAMPolicy
    }
}
export { SyncUtils }

// @public (undocumented)
export interface TransformConfig {
    // (undocumented)
    DisableResolverDeduping?: boolean;
    // (undocumented)
    NodeToNodeEncryption?: boolean;
    // (undocumented)
    StackMapping?: {
        [resourceId: string]: string;
    };
    // (undocumented)
    TransformerOptions?: {
        [transformer: string]: {
            [option: string]: any;
        };
    };
    // (undocumented)
    transformers?: string[];
}

// @public (undocumented)
export abstract class TransformerAuthBase extends TransformerPluginBase implements TransformerAuthProvider {
    constructor(name: string, doc: DocumentNode_2 | string, type?: TransformerPluginType);
}

// @public (undocumented)
export class TransformerContractError extends Error {
    constructor(message: string);
}

// @public (undocumented)
export abstract class TransformerModelBase extends TransformerPluginBase implements TransformerModelProvider {
    constructor(name: string, document: DocumentNode_2 | string, type?: TransformerPluginType);
    // (undocumented)
    abstract generateCreateResolver: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateDeleteResolver: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateGetResolver: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateListResolver: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateOnCreateResolver?: (ctx: TransformerContextProvider, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateOnDeleteResolver?: (ctx: TransformerContextProvider, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateOnUpdateResolver?: (ctx: TransformerContextProvider, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateSyncResolver?: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract generateUpdateResolver: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, typeName: string, fieldName: string, resolverLogicalId: string, directive?: DirectiveDefinitionNode) => TransformerResolverProvider;
    // (undocumented)
    abstract getDataSourceResource: (type: ObjectTypeDefinitionNode) => DataSourceInstance;
    // (undocumented)
    abstract getDataSourceType: () => AppSyncDataSourceType;
    // (undocumented)
    abstract getInputs: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, operation: {
        fieldName: string;
        typeName: string;
        type: QueryFieldType | MutationFieldType | SubscriptionFieldType;
    }) => InputValueDefinitionNode[];
    // (undocumented)
    abstract getMutationFieldNames: (type: ObjectTypeDefinitionNode, directive?: DirectiveDefinitionNode) => Set<{
        fieldName: string;
        typeName: string;
        type: MutationFieldType;
    }>;
    // (undocumented)
    abstract getOutputType: (ctx: TransformerContextProvider, type: ObjectTypeDefinitionNode, operation: {
        fieldName: string;
        typeName: string;
        type: QueryFieldType | MutationFieldType | SubscriptionFieldType;
    }) => ObjectTypeDefinitionNode;
    // (undocumented)
    abstract getQueryFieldNames: (type: ObjectTypeDefinitionNode, directive?: DirectiveDefinitionNode) => Set<{
        fieldName: string;
        typeName: string;
        type: QueryFieldType;
    }>;
    // (undocumented)
    abstract getSubscriptionFieldNames: (type: ObjectTypeDefinitionNode, directive?: DirectiveDefinitionNode) => Set<{
        fieldName: string;
        typeName: string;
        type: SubscriptionFieldType;
    }>;
}

// @public (undocumented)
export abstract class TransformerModelEnhancerBase extends TransformerModelBase implements TransformerModelEnhancementProvider {
    constructor(name: string, doc: DocumentNode_2 | string, type?: TransformerPluginType);
}

// @public (undocumented)
export class TransformerNestedStack extends TransformerRootStack {
    // Warning: (ae-forgotten-export) The symbol "TransformerNestedStackProps" needs to be exported by the entry point index.d.ts
    constructor(scope: Construct, id: string, props?: TransformerNestedStackProps);
    // (undocumented)
    readonly nestedStackResource?: CfnResource;
    // (undocumented)
    setParameter(name: string, value: string): void;
    // (undocumented)
    get stackId(): string;
    // (undocumented)
    get stackName(): string;
    // (undocumented)
    readonly templateFile: string;
}

// @public (undocumented)
export abstract class TransformerPluginBase implements TransformerPluginProvider {
    constructor(name: string, document: DocumentNode_2 | string, pluginType?: TransformerPluginType);
    // (undocumented)
    protected debug(message: string): void;
    // (undocumented)
    readonly directive: DirectiveDefinitionNode;
    // (undocumented)
    protected error(message: string): void;
    // (undocumented)
    getLogs(): TransformerLog[];
    // (undocumented)
    protected info(message: string): void;
    // (undocumented)
    readonly name: string;
    // (undocumented)
    readonly pluginType: TransformerPluginType;
    // (undocumented)
    readonly typeDefinitions: TypeDefinitionNode[];
    // (undocumented)
    protected warn(message: string): void;
}

// @public (undocumented)
export interface TransformerProjectConfig {
    // (undocumented)
    config: TransformConfig;
    // (undocumented)
    functions: Record<string, string>;
    // (undocumented)
    modelToDatasourceMap: Map<string, DatasourceType>;
    // (undocumented)
    pipelineFunctions: Record<string, string>;
    // (undocumented)
    resolvers: Record<string, string>;
    // (undocumented)
    schema: string;
    // Warning: (ae-forgotten-export) The symbol "Template_2" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    stacks: Record<string, Template_2>;
}

// @public (undocumented)
export class TransformerResolver implements TransformerResolverProvider {
    constructor(typeName: string, fieldName: string, resolverLogicalId: string, requestMappingTemplate: MappingTemplateProvider, responseMappingTemplate: MappingTemplateProvider, requestSlots: string[], responseSlots: string[], datasource?: DataSourceProvider | undefined);
    // (undocumented)
    addToSlot: (slotName: string, requestMappingTemplate?: MappingTemplateProvider, responseMappingTemplate?: MappingTemplateProvider, dataSource?: DataSourceProvider) => void;
    // Warning: (ae-forgotten-export) The symbol "Slot" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    findSlot: (slotName: string, requestMappingTemplate?: MappingTemplateProvider, responseMappingTemplate?: MappingTemplateProvider) => Slot | undefined;
    // (undocumented)
    mapToStack: (stack: Stack) => void;
    // (undocumented)
    slotExists: (slotName: string, requestMappingTemplate?: MappingTemplateProvider, responseMappingTemplate?: MappingTemplateProvider) => boolean;
    // (undocumented)
    synthesize: (context: TransformerContextProvider, api: GraphQLAPIProvider) => void;
    // (undocumented)
    synthesizeResolvers: (stack: Stack, api: GraphQLAPIProvider, slotsNames: string[]) => AppSyncFunctionConfigurationProvider[];
    // (undocumented)
    updateSlot: (slotName: string, requestMappingTemplate?: MappingTemplateProvider, responseMappingTemplate?: MappingTemplateProvider) => void;
}

// @public (undocumented)
export class UnknownDirectiveError extends Error {
    constructor(message: string);
}

// @public (undocumented)
export type UserDefinedResolver = {
    fileName: string;
    template: string;
};

// @public (undocumented)
export type UserDefinedSlot = {
    resolverTypeName: string;
    resolverFieldName: string;
    slotName: string;
    requestResolver?: UserDefinedResolver;
    responseResolver?: UserDefinedResolver;
};

// @public (undocumented)
export const validateModelSchema: (doc: DocumentNode) => readonly GraphQLError[];

// @public (undocumented)
function validateResolverConfigForType(ctx: TransformerSchemaVisitStepContextProvider, typeName: string): void;

// Warnings were encountered during analysis:
//
// src/config/transformer-config.ts:26:3 - (ae-forgotten-export) The symbol "LambdaConflictHandler" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```
