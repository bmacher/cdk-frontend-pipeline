import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';

/** Adds frontend load from repo stage to pipeline. */
export function addGetFrontendSourceStage(
  pipeline: codepipeline.Pipeline,
  repository: codecommit.IRepository,
) {
  const frontendSourceOutput = new codepipeline.Artifact();

  const frontendSourceAction = new codepipelineActions.CodeCommitSourceAction({
    actionName: 'get-frontend-source',
    repository,
    branch: 'master',
    output: frontendSourceOutput,
  });

  pipeline.addStage({
    stageName: 'get-frontend-source',
    actions: [frontendSourceAction],
  });

  return {
    frontendSourceOutput,
  };
}
