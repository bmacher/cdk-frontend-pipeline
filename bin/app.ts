import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';
import { PipelineStack } from '../lib/pipeline';
import { accounts } from '../accounts';

if (!accounts) {
  // interface { dev: string; res: string; }
  throw new Error('You have to provide res & dev acounnt via accounts.ts in root');
}

const app = new cdk.App();

const infraStack = new InfraStack(app, 'sfubt-infrastructure');

const pipelineStack = new PipelineStack(app, 'sfubt-pipeline', {
  env: { account: accounts.res, region: 'eu-west-1' },
  infraRepoArn: infraStack.infraRepoArn,
});

pipelineStack.addDependency(infraStack);

app.synth();
