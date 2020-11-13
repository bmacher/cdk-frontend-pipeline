import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { addGetFrontendSourceStage } from './add-get-frontend-source-stage';
import { addBuildFrontendStage } from './add-build-frontend-stage';
import { addDeployFrontendStage } from './add-deploy-frontend-stage';

interface PipelineStackProps extends cdk.StackProps {
  webBucket: s3.Bucket;
  frontendRepoArn: string;
  pipelineRepoArn: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: PipelineStackProps) {
    super(scope, id);

    const { webBucket, frontendRepoArn /* pipelineRepoArn */ } = props;

    const frontendRepo = codecommit.Repository.fromRepositoryArn(
      this, 'FrontendRepository', frontendRepoArn,
    );

    /* const pipelineRepo = codecommit.Repository.fromRepositoryArn(
      this, 'PipelineRepository', pipelineRepoArn,
    ); */

    const pipeline = new codepipeline.Pipeline(this, 'SfubtDeployFrontendPipeline', {
      pipelineName: 'sfubt-deploy-frontend-pipeline',
    });

    // webBucket.grantPut(pipeline.role);

    const { frontendSourceArtifact } = addGetFrontendSourceStage(pipeline, frontendRepo);
    const { frontendBuildArtifact } = addBuildFrontendStage(
      pipeline, frontendRepo, frontendSourceArtifact,
    );
    addDeployFrontendStage(pipeline, webBucket, frontendBuildArtifact);
  }
}
