import '@aws-cdk/assert/jest';
import * as assert from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { FrontendPipelineStack } from '../lib/frontend-build-pipeline';

describe('FrontendPipelineStack', () => {
  const app = new cdk.App();

  const frontendPipelineStack = new FrontendPipelineStack(app, 'FrontendPipelineStack', {});

  it('should have a secured S3 Bucket', () => {
    expect(frontendPipelineStack).toHaveResource('AWS::S3::Bucket', {
      Properties: {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
        },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      },
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    }, assert.ResourcePart.CompleteDefinition);
  });

  it('should have a pipeline with 3 stages', () => {
    expect(frontendPipelineStack).toHaveResource('AWS::CodePipeline::Pipeline', {
      Stages: [
        {
          Name: 'get-frontend-source',
          Actions: [
            assert.objectLike({
              Name: 'get-frontend-source',
              RunOrder: 1,
              ActionTypeId: {
                Category: 'Source',
                Owner: 'AWS',
                Provider: 'CodeCommit',
                Version: '1',
              },
              Configuration: assert.objectLike({
                BranchName: 'master',
                PollForSourceChanges: false,
              }),
            }),
          ],
        },
        {
          Name: 'build-frontend',
          Actions: [
            assert.objectLike({
              Name: 'build-frontend',
              RunOrder: 1,
              ActionTypeId: {
                Category: 'Build',
                Owner: 'AWS',
                Provider: 'CodeBuild',
                Version: '1',
              },
            }),
          ],
        },
        {
          Name: 'deploy-frontend',
          Actions: [
            assert.objectLike({
              Name: 'deploy-frontend-to-s3',
              RunOrder: 1,
              ActionTypeId: {
                Category: 'Deploy',
                Owner: 'AWS',
                Provider: 'S3',
                Version: '1',
              },
            }),
          ],
        },
      ],
    });
  });
});
