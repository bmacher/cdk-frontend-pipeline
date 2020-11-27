import * as cdk from '@aws-cdk/core';
import { FrontendBuildPipelineStack } from '../frontend-build-pipeline';

import { accounts } from '../../accounts';

export class FrontendBuildPipelineStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string/* , props: cdk.StageProps */) {
    super(scope, id, {
      env: { account: accounts.dev, region: 'eu-west-1' },
    });

    new FrontendBuildPipelineStack(this, 'sfubt-frontend-pipeline', {
      stackName: 'sfubt-frontend-pipeline',
    });
  }
}
