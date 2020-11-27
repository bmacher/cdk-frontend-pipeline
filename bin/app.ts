import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';
import { PipelineStack } from '../lib/pipeline';

const app = new cdk.App();

const infraStack = new InfraStack(app, 'sfubt-infrastructure');

new PipelineStack(app, 'sfubt-pipeline', {
  // env: { account: '', region: 'eu-west-1' },
  infraRepoArn: infraStack.infraRepoArn,
  frontendRepoArn: infraStack.frontendRepoArn,
  webBucketArn: infraStack.webBucket.bucketArn,
});
