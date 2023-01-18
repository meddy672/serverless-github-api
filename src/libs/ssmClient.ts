import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const ssmClient = (): AWS.SSM => {
    if (process.env.NODE_ENV === 'test') {
        return new AWS.SSM({region: 'us-east-1'});
    } else {
        const XAWS = AWSXRay.captureAWS(AWS);
        return new XAWS.SSM({region: 'us-east-1'});
    }
}

const ssm = ssmClient();

export { ssm };