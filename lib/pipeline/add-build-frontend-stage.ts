import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as codebuild from '@aws-cdk/aws-codebuild';

/** Adds frontend build stage to pipeline. */
export function addBuildFrontendStage(
  pipeline: codepipeline.Pipeline,
  inputArtifact: codepipeline.Artifact,
) {
  const frontendBuildOutput = new codepipeline.Artifact();

  const buildFrontendProject = new codebuild.PipelineProject(
    cdk.Stack.of(pipeline),
    'PipelineProjectFrontend',
    {
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
        computeType: codebuild.ComputeType.LARGE,
      },
      // Helps sometimes with speeding up the provisioning stage of the codebuild project
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER),
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
    },
  );

  const frontendBuildAction = new codepipelineActions.CodeBuildAction({
    actionName: 'build-frontend',
    input: inputArtifact,
    project: buildFrontendProject,
    outputs: [frontendBuildOutput],
  });

  pipeline.addStage({
    stageName: 'build-frontend',
    actions: [frontendBuildAction],
  });

  return {
    frontendBuildOutput,
  };
}
