import { Context } from "aws-lambda";
import when from '../../steps/when';
import _axios from "../../../src/libs/axios";

const context: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'pullRequest',
    functionVersion: '',
    invokedFunctionArn: 'us-east-1:123456789012',
    memoryLimitInMB: '256',
    awsRequestId: 'db6839f0-7ca9-4044-a217-74ee2ab853c7',
    logGroupName: '',
    logStreamName: '',
    done: () => { },
    fail: () => { },
    succeed: () => { },
    getRemainingTimeInMillis: () => 1
};

describe('pulls.handler', () => {

    describe('Integrates with all services correctly', () => {

        test('returns statusCode 200 with correct message', async () => {
            const event: any = {
                requestContext: { requestId: '6cd0ee77-1564-4bba-862e-849756b5db53'},
                queryStringParameters: { gitHubRepo: 'agenda/agenda' }
            }
            const result = await when.we_invoke_get_pull_request(event, context);
            expect(result).toBeDefined()
            expect(result.body).toBeDefined()
            expect(result.statusCode).toEqual(200)
        });
    });
})