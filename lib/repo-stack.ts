import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class RepoStack extends cdk.Stack {
  public readonly frontendRepoArn: string;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const frontendRepo = new codecommit.Repository(this, 'FrontendRepository', {
      repositoryName: 'sfubt-frontend',
    });

    this.frontendRepoArn = frontendRepo.repositoryArn;
  }
}
