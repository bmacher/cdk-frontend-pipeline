import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';

export function addBuildFrontendStage(
  pipeline: codepipeline.Pipeline,
  sourceRepo: codecommit.IRepository,
  sourceArtifact: codepipeline.Artifact,
) {
  const frontendBuildArtifact = new codepipeline.Artifact();

  const buildFrontendProject = new codebuild.Project(
    cdk.Stack.of(pipeline),
    'SfubtCodebuildFrontend',
    {
      source: codebuild.Source.codeCommit({ repository: sourceRepo }),
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
        computeType: codebuild.ComputeType.LARGE,
      },
      // Helps sometimes with speeding up the provisioning stage of the codebuild project
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER),
      buildSpec: codebuild.BuildSpec.fromSourceFilename('./buildspec.yml'),
    },
  );

  const frontendBuildAction = new codepipelineActions.CodeBuildAction({
    actionName: 'build-frontend',
    input: sourceArtifact,
    project: buildFrontendProject,
    outputs: [frontendBuildArtifact],
  });

  pipeline.addStage({
    stageName: 'build-frontend',
    actions: [frontendBuildAction],
  });

  return {
    frontendBuildArtifact,
  };
}
