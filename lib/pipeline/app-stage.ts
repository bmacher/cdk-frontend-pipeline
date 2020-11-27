import * as cdk from '@aws-cdk/core';
import { FrontendPipelineStack } from '../frontend-pipeline';

export class ApplicationStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: cdk.StageProps) {
    super(scope, id, {
      env: props.env,
    });

    new FrontendPipelineStack(this, 'sfubt-frontend-pipeline', {
      stackName: 'sfubt-frontend-pipeline',
    });
  }
}
