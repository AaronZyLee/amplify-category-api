/* eslint-disable max-classes-per-file */
import {
  TransformerPluginType,
  TransformerModelProvider,
  AppSyncDataSourceType,
  TransformerContextProvider,
  TransformerResolverProvider,
  QueryFieldType,
  MutationFieldType,
  SubscriptionFieldType,
  DataSourceInstance,
  TransformerPluginProvider,
  TransformerModelEnhancementProvider,
  TransformerAuthProvider,
  TransformerLog,
  TransformerLogLevel,
} from '@aws-amplify/graphql-transformer-interfaces';

import {
  DirectiveDefinitionNode,
  TypeDefinitionNode,
  DocumentNode,
  Kind,
  ObjectTypeDefinitionNode,
  parse,
  InputValueDefinitionNode,
} from 'graphql';

import { InvalidTransformerError } from '../errors';

/**
 * TransformerPluginBase
 */
export abstract class TransformerPluginBase implements TransformerPluginProvider {
  public readonly name: string;
  public readonly directive: DirectiveDefinitionNode;

  public readonly typeDefinitions: TypeDefinitionNode[];
  private logs: TransformerLog[];
  constructor(
    name: string,
    document: DocumentNode | string,
    public readonly pluginType: TransformerPluginType = TransformerPluginType.GENERIC,
  ) {
    const doc = typeof document === 'string' ? parse(document) : document;
    this.name = name;
    const directives = doc.definitions.filter((d) => d.kind === Kind.DIRECTIVE_DEFINITION) as DirectiveDefinitionNode[];
    const extraDefinitions = doc.definitions.filter((d) => d.kind !== Kind.DIRECTIVE_DEFINITION) as TypeDefinitionNode[];
    if (directives.length !== 1) {
      throw new InvalidTransformerError('Transformers must specify exactly one directive definition.');
    }
    [this.directive] = directives;

    // Transformers can define extra shapes that can be used by the directive
    // and validated. TODO: Validation.
    this.typeDefinitions = extraDefinitions;
    this.logs = [];
  }

  private log(level: TransformerLogLevel, message: string) {
    this.logs.push({ level, message });
  }

  protected error(message: string) {
    this.log(TransformerLogLevel.ERROR, message);
  }

  protected warn(message: string) {
    this.log(TransformerLogLevel.WARN, message);
  }

  protected info(message: string) {
    this.log(TransformerLogLevel.INFO, message);
  }

  protected debug(message: string) {
    this.log(TransformerLogLevel.DEBUG, message);
  }

  public getLogs(): TransformerLog[] {
    return this.logs;
  }
}
/**
 * TransformerModelBase
 */
export abstract class TransformerModelBase extends TransformerPluginBase implements TransformerModelProvider {
  constructor(name: string, document: DocumentNode | string, type: TransformerPluginType = TransformerPluginType.DATA_SOURCE_PROVIDER) {
    super(name, document, type);
  }

  abstract getDataSourceType: () => AppSyncDataSourceType;

  abstract generateGetResolver: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateListResolver: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateCreateResolver: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateUpdateResolver: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateDeleteResolver: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateOnCreateResolver?: (
    ctx: TransformerContextProvider,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateOnUpdateResolver?: (
    ctx: TransformerContextProvider,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateOnDeleteResolver?: (
    ctx: TransformerContextProvider,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract generateSyncResolver?: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    typeName: string,
    fieldName: string,
    resolverLogicalId: string,
    directive?: DirectiveDefinitionNode,
  ) => TransformerResolverProvider;

  abstract getQueryFieldNames: (
    type: ObjectTypeDefinitionNode,
    directive?: DirectiveDefinitionNode,
  ) => Set<{ fieldName: string; typeName: string; type: QueryFieldType }>;

  abstract getMutationFieldNames: (
    type: ObjectTypeDefinitionNode,
    directive?: DirectiveDefinitionNode,
  ) => Set<{ fieldName: string; typeName: string; type: MutationFieldType }>;

  abstract getSubscriptionFieldNames: (
    type: ObjectTypeDefinitionNode,
    directive?: DirectiveDefinitionNode,
  ) => Set<{
    fieldName: string;
    typeName: string;
    type: SubscriptionFieldType;
  }>;

  // Get instance of the CDK resource to augment the table (like adding additional indexes)
  abstract getDataSourceResource: (type: ObjectTypeDefinitionNode) => DataSourceInstance;

  abstract getInputs: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    operation: {
      fieldName: string;
      typeName: string;
      type: QueryFieldType | MutationFieldType | SubscriptionFieldType;
    },
  ) => InputValueDefinitionNode[];

  abstract getOutputType: (
    ctx: TransformerContextProvider,
    type: ObjectTypeDefinitionNode,
    operation: {
      fieldName: string;
      typeName: string;
      type: QueryFieldType | MutationFieldType | SubscriptionFieldType;
    },
  ) => ObjectTypeDefinitionNode;
}

/**
 * TransformerModelEnhancerBase
 */
export abstract class TransformerModelEnhancerBase extends TransformerModelBase implements TransformerModelEnhancementProvider {
  constructor(name: string, doc: DocumentNode | string, type: TransformerPluginType = TransformerPluginType.DATA_SOURCE_ENHANCER) {
    super(name, doc, type);
  }
}

/**
 * TransformerAuthBase
 */
export abstract class TransformerAuthBase extends TransformerPluginBase implements TransformerAuthProvider {
  constructor(name: string, doc: DocumentNode | string, type: TransformerPluginType = TransformerPluginType.AUTH) {
    super(name, doc, type);
  }
}
