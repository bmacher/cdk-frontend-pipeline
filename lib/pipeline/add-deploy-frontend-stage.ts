import * as s3 from '@aws-cdk/aws-s3';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';

export function addDeployFrontendStage(
  pipeline: codepipeline.Pipeline,
  webBucket: s3.Bucket,
  sourceArtifact: codepipeline.Artifact,
) {
  const deployFrontendToS3Action = new codepipelineActions.S3DeployAction({
    actionName: 'deliver-frontend-to-s3',
    bucket: webBucket,
    input: sourceArtifact,
  });

  pipeline.addStage({
    stageName: 'deploy-frontend',
    actions: [deployFrontendToS3Action],
  });
}
