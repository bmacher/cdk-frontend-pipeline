import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class RepoStack extends cdk.Stack {
  public readonly pipelineRepoArn: string;

  public readonly frontendRepoArn: string;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const pipelineRepo = new codecommit.Repository(this, 'PipelineRepository', {
      repositoryName: 'sfubt-pipeline',
    });

    this.pipelineRepoArn = pipelineRepo.repositoryArn;

    const frontendRepo = new codecommit.Repository(this, 'FrontendRepository', {
      repositoryName: 'sfubt-frontend',
    });

    this.frontendRepoArn = frontendRepo.repositoryArn;
  }
}
