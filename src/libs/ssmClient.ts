import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

const ssm = new XAWS.SSM({region: 'us-east-1'});

export { ssm };