#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RepoStack } from '../lib/repo-stack';
import { PipelineStack } from '../lib/pipeline/pipeline-stack';
import { ResourceStack } from '../lib/resource-stack';

const app = new cdk.App();

const repoStack = new RepoStack(app, 'SfubtRepoStack');
const resourceStack = new ResourceStack(app, 'SfubtResourceStack');

new PipelineStack(app, 'SfubtPipelineStack', {
  webBucketArn: resourceStack.webBucket.bucketArn,
  frontendRepoArn: repoStack.frontendRepoArn,
});
