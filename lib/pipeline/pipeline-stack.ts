import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { addGetFrontendSourceStage } from './add-get-frontend-source-stage';
import { addBuildFrontendStage } from './add-build-frontend-stage';
import { addDeployFrontendToS3Stage } from './add-deploy-frontend-stage';

interface FrontendPipelineStackProps extends cdk.StackProps {
  webBucketArn: string;
  frontendRepoArn: string;
}

export class FrontendPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: FrontendPipelineStackProps) {
    super(scope, id);

    const { webBucketArn, frontendRepoArn } = props;

    const frontendRepo = codecommit.Repository.fromRepositoryArn(
      this, 'FrontendRepository', frontendRepoArn,
    );

    const artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const pipeline = new codepipeline.Pipeline(this, 'FrontendDeploymentPipeline', {
      pipelineName: `${this.stackName}-frontend-deployment-pipeline`,
      artifactBucket,
    });

    const { frontendSourceOutput } = addGetFrontendSourceStage(pipeline, frontendRepo);

    const { frontendBuildOutput } = addBuildFrontendStage(pipeline, frontendSourceOutput);

    addDeployFrontendToS3Stage(pipeline, frontendBuildOutput, webBucketArn);
  }
}
