import './polyfills/Object.assign';
import { print } from 'graphql';
import { TransformerContext, MappingParameters } from './TransformerContext';
import { Transformer } from './Transformer';
import { ITransformer } from './ITransformer';
import { GraphQLTransform } from './GraphQLTransform';
import { collectDirectiveNames, collectDirectivesByType, collectDirectivesByTypeNames } from './collectDirectives';
import { stripDirectives } from './stripDirectives';
import { DeploymentResources } from '@aws-amplify/graphql-transformer-interfaces';
import {
  buildProject as buildAPIProject,
  uploadDeployment as uploadAPIProject,
  migrateAPIProject,
  revertAPIMigration,
  CLOUDFORMATION_FILE_NAME,
  PARAMETERS_FILE_NAME,
  getSanityCheckRules,
} from './util/amplifyUtils';
import {
  readSchema as readProjectSchema,
  loadProject as readProjectConfiguration,
  loadConfig as readTransformerConfiguration,
  writeConfig as writeTransformerConfiguration,
  TRANSFORM_CONFIG_FILE_NAME,
  TRANSFORM_BASE_VERSION,
  TRANSFORM_CURRENT_VERSION,
  TransformConfig,
  ConflictHandlerType,
  ConflictDetectionType,
  ResolverConfig,
  SyncConfig,
} from './util/transformConfig';
import { EXTRA_DIRECTIVES_DOCUMENT } from './validation';
export * from './errors';
export * from './util';
export { getTableNameForModel } from './tableNameMap';

/**
 * Returns the set of directives that are supported by AppSync service
 */
export function getAppSyncServiceExtraDirectives(): string {
  return print(EXTRA_DIRECTIVES_DOCUMENT);
}
export { FeatureFlagProvider } from './FeatureFlags';

export {
  GraphQLTransform,
  TransformConfig,
  TransformerContext,
  MappingParameters,
  Transformer,
  ITransformer,
  collectDirectiveNames,
  collectDirectivesByType,
  collectDirectivesByTypeNames,
  stripDirectives,
  buildAPIProject,
  migrateAPIProject,
  uploadAPIProject,
  readProjectSchema,
  readProjectConfiguration,
  readTransformerConfiguration,
  writeTransformerConfiguration,
  revertAPIMigration,
  TRANSFORM_CONFIG_FILE_NAME,
  TRANSFORM_BASE_VERSION,
  TRANSFORM_CURRENT_VERSION,
  ConflictHandlerType,
  ConflictDetectionType,
  ResolverConfig,
  SyncConfig,
  DeploymentResources,
  CLOUDFORMATION_FILE_NAME,
  PARAMETERS_FILE_NAME,
  getSanityCheckRules,
};
// No-op change to trigger publish
