import * as cdk from '@aws-cdk/core';
import { FrontendPipelineStack } from '../frontend-pipeline';

interface ApplicationStageProps extends cdk.StackProps {
  frontendRepoArn: string;
  webBucketArn: string;
}

export class ApplicationStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: ApplicationStageProps) {
    super(scope, id, {
      env: props.env,
    });

    const { frontendRepoArn, webBucketArn } = props;

    new FrontendPipelineStack(this, 'sfubt-frontend-pipeline', {
      stackName: 'sfubt-frontend-pipeline',
      frontendRepoArn,
      webBucketArn,
    });
  }
}
