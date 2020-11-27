import * as cdk from '@aws-cdk/core';
import { accounts } from '../../accounts';
import { FrontendInfraStack } from '../frontend-infra';

export class ApplicationStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, {
      env: { account: accounts.dev, region: 'eu-west-1' },
    });

    new FrontendInfraStack(this, 'sfubt-frontend-infra', props);
  }
}
