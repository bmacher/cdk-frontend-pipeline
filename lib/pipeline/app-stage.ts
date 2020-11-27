import * as cdk from '@aws-cdk/core';
import { FrontendPipelineStack } from '../frontend-pipeline';

const accounts: { account2: string; } = require('../../accounts.json');

export class ApplicationStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string/* , props: cdk.StageProps */) {
    super(scope, id, {
      env: { account: accounts.account2, region: 'eu-west-1' },
    });

    new FrontendPipelineStack(this, 'sfubt-frontend-pipeline', {
      stackName: 'sfubt-frontend-pipeline',
    });
  }
}
