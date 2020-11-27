import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';
import { PipelineStack } from '../lib/pipeline';

const accounts: { account1: string; } = require('../accounts.json');

if (!accounts) {
  throw new Error('You have to provide 2 acounnts via accounts.json in root');
}

const app = new cdk.App();

const infraStack = new InfraStack(app, 'sfubt-infrastructure');

const pipelineStack = new PipelineStack(app, 'sfubt-pipeline', {
  env: { account: accounts.account1, region: 'eu-west-1' },
  infraRepoArn: infraStack.infraRepoArn,
});

pipelineStack.addDependency(infraStack);

app.synth();
