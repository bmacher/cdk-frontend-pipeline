#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline-stack';
import { RepoStack } from '../lib/repo-stack';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack');

new RepoStack(app, 'SfubtRepoStack');
