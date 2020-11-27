import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as s3 from '@aws-cdk/aws-s3';

export class InfraStack extends cdk.Stack {
  public readonly frontendRepoArn: string;

  public readonly infraRepoArn: string;

  public readonly webBucket: s3.Bucket;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const infraRepo = new codecommit.Repository(this, 'InfrastructureRepository', {
      repositoryName: 'sfubt-infrastructure',
    });

    this.infraRepoArn = infraRepo.repositoryArn;

    const frontendRepo = new codecommit.Repository(this, 'FrontendRepository', {
      repositoryName: 'sfubt-frontend',
    });

    this.frontendRepoArn = frontendRepo.repositoryArn;

    const webBucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.webBucket = webBucket;
  }
}
