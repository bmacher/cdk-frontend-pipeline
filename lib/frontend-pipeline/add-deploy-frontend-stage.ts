import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';

/** Adds frontend deployment to S3 stage to pipeline. */
export function addDeployFrontendToS3Stage(
  pipeline: codepipeline.Pipeline,
  input: codepipeline.Artifact,
  webBucket: s3.Bucket,
) {
  const deployFrontendToS3Action = new codepipelineActions.S3DeployAction({
    actionName: 'deploy-frontend-to-s3',
    bucket: webBucket,
    input,
  });

  pipeline.addStage({
    stageName: 'deploy-frontend',
    actions: [deployFrontendToS3Action],
  });
}
