import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';

/** Adds frontend deployment to S3 stage to pipeline. */
export function addDeployFrontendToS3Stage(
  pipeline: codepipeline.Pipeline,
  inputArtifact: codepipeline.Artifact,
  webBucketArn: string,
) {
  const deployFrontendToS3Action = new codepipelineActions.S3DeployAction({
    actionName: 'deploy-frontend-to-s3',
    bucket: s3.Bucket.fromBucketArn(cdk.Stack.of(pipeline), 'WebBucketArn', webBucketArn),
    input: inputArtifact,
  });

  pipeline.addStage({
    stageName: 'deploy-frontend',
    actions: [deployFrontendToS3Action],
  });
}
