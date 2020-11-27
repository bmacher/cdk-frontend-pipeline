import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as codecommit from '@aws-cdk/aws-codecommit';
import { ApplicationStage } from './app-stage';

interface PipelineStackProps extends cdk.StackProps {
  // env: cdk.Environment,
  infraRepoArn: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { infraRepoArn } = props;

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const sourceAction = new codepipelineActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      output: sourceArtifact,
      repository: codecommit.Repository.fromRepositoryArn(this, 'SfubtInfraRepo', infraRepoArn),
      branch: 'master',
    });

    const synthAction = pipelines.SimpleSynthAction.standardYarnSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
    });

    const pipeline = new pipelines.CdkPipeline(this, 'SfubtPipeline', {
      pipelineName: 'sfubt-pipeline',
      cloudAssemblyArtifact,
      sourceAction,
      synthAction,
    });

    pipeline.addApplicationStage(new ApplicationStage(this, 'DeployFrontendPipeline', { env: props.env }));
  }
}
