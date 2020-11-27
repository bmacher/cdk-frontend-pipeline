import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ssm from '@aws-cdk/aws-ssm';
import { ssmParamNames } from './ssm-param-names';

export class InfraStack extends cdk.Stack {
  public readonly infraRepoArn: string;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const infraRepo = new codecommit.Repository(this, 'InfrastructureRepository', {
      repositoryName: 'sfubt-infrastructure',
    });

    this.infraRepoArn = infraRepo.repositoryArn;

    const frontendRepo = new codecommit.Repository(this, 'FrontendRepository', {
      repositoryName: 'sfubt-frontend',
    });

    new ssm.StringParameter(this, 'FrontendRepositoryArn', {
      parameterName: ssmParamNames.FRONTEND_REPO_ARN,
      description: 'ARN of the Frontend Repository.',
      stringValue: frontendRepo.repositoryArn,
    });
  }
}
