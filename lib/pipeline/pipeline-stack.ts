import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { addGetFrontendSourceStage } from './add-get-frontend-source-stage';
import { addBuildFrontendStage } from './add-build-frontend-stage';
import { addDeployFrontendToS3Stage } from './add-deploy-frontend-stage';

interface PipelineStackProps extends cdk.StackProps {
  webBucketArn: string;
  frontendRepoArn: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: PipelineStackProps) {
    super(scope, id);

    const { webBucketArn, frontendRepoArn } = props;

    const frontendRepo = codecommit.Repository.fromRepositoryArn(
      this, 'FrontendRepository', frontendRepoArn,
    );

    const pipeline = new codepipeline.Pipeline(this, 'FrontendDeployPipeline', {
      pipelineName: `${this.stackName}-deploy-frontend-pipeline`,
    });

    const { frontendSourceOutput } = addGetFrontendSourceStage(pipeline, frontendRepo);

    const { frontendBuildOutput } = addBuildFrontendStage(pipeline, frontendSourceOutput);

    addDeployFrontendToS3Stage(pipeline, frontendBuildOutput, webBucketArn);
  }
}
