import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as ssm from '@aws-cdk/aws-ssm';
import { ssmParamNames } from '../ssm-param-names';

export class FrontendInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webBucket = new s3.Bucket(this, 'WebBucket', {
      websiteIndexDocument: 'index.html',
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new ssm.StringParameter(this, 'WebBucketArnParam', {
      parameterName: ssmParamNames.WEB_BUCKET_DEV_ARN,
      description: 'ARN of the Bucket where Frontend is deployed to.',
      stringValue: webBucket.bucketArn,
    });
  }
}
