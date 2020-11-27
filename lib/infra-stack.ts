import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as s3 from '@aws-cdk/aws-s3';
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

    const webBucket = new s3.Bucket(this, 'WebBucket', {
      websiteIndexDocument: 'index.html',
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new ssm.StringParameter(this, 'WebBucketArn', {
      parameterName: ssmParamNames.WEB_BUCKET_ARN,
      description: 'ARN of the Bucket where the Frontend is deployed to.',
      stringValue: webBucket.bucketArn,
    });
  }
}
