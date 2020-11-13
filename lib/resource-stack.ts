import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class ResourceStack extends cdk.Stack {
  public readonly webBucket: s3.Bucket;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const webBucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.webBucket = webBucket;
  }
}
