import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import * as ssm from '@aws-cdk/aws-ssm';
import { addGetFrontendSourceStage } from './add-get-frontend-source-stage';
import { addBuildFrontendStage } from './add-build-frontend-stage';
import { addDeployFrontendToS3Stage } from './add-deploy-frontend-stage';
import { ssmParamNames } from '../ssm-param-names';

export class FrontendBuildPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const frontendRepoArn = ssm.StringParameter.fromStringParameterName(this, 'FrontendRepositoryArn', ssmParamNames.FRONTEND_REPO_ARN);

    const frontendRepo = codecommit.Repository.fromRepositoryArn(
      this, 'FrontendRepository', frontendRepoArn.stringValue,
    );

    const webBucketArn = ssm.StringParameter.fromStringParameterName(this, 'WebBucketyArn', ssmParamNames.WEB_BUCKET_DEV_ARN);

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

    addDeployFrontendToS3Stage(pipeline, frontendBuildOutput, webBucketArn.stringValue);
  }
}
