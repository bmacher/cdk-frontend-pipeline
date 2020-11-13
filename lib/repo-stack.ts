import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class RepoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new codecommit.Repository(this, 'PipelineRepository', {
      repositoryName: 'sfubt-pipeline',
    });

    new codecommit.Repository(this, 'FrontendRepository', {
      repositoryName: 'sfubt-frontend',
    });
  }
}
