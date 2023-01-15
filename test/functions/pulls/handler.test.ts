import { Context } from "aws-lambda";
import { main } from '../../../src/functions/pulls/handler';
import _axios from "../../../src/libs/axios";


const successMock = jest.fn();
const failureMock = jest.fn();
const noPRMock = jest.fn();

jest.mock('../../../src/libs/axios', () => {
    return Object.assign({
        default: jest.fn(),
        get: jest.fn(),
        create: jest.fn(() => {
            return {
                interceptors: {
                    request: { use: jest.fn(), eject: jest.fn() },
                    response: { use: jest.fn(), eject: jest.fn() }
                  }
            }
        })
    })
});

jest.mock('@middy/core', () => {
    return (handler) => {
        return {
            use: jest.fn().mockReturnValue(handler)
        }
    }
});



jest.mock('aws-sdk');

jest.mock('../../../src/libs/ssmClient', () => {
    return {
        ssm: {
            getParameter: () => {
                return {
                    promise: () => {
                        return {
                            Parameter: {
                                Name: 'NAME',
                                Type: 'SecureString',
                                Value: 'VALUE',
                                Version: 1,
                                LastModifiedDate: 1546551668.495,
                                ARN: 'arn:aws:ssm:ap-southeast-2:123:NAME'
                              }
                        }
                    }
                }
            }
        }
    }
})

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



describe('hello.handler', () => {

    describe('Success', () => {
        beforeEach(() => {
            _axios.get = successMock.mockResolvedValueOnce({
                data: [
                    {
                        id: 123,
                        number: 891211,
                        title: 'Hello World',
                        user: {
                            login: 'meddy672'
                        },
                        state: 'open'
                    }
                ]
            }).mockResolvedValueOnce({
                data: [
                    {
                        commit_id: 89877,
                        files: 3,
                        id: 33,
                    },
                    {
                        commit_id: 543,
                        files: 1,
                        id: 9998,
                    }
                ]
            });
        });
        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        test('returns statusCode 200 and body with mappedPullRequest', async () => {
            const event: any = {
                requestContext: { requestId: '6cd0ee77-1564-4bba-862e-849756b5db53'},
                queryStringParameters: { gitHubRepo: 'agenda/agenda' }
            }
            const result = await main(event, context)
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    message: "Open pull request",
                    results: [
                        {
                            id: 123,
                            number: 891211,
                            title: "Hello World",
                            author: "meddy672",
                            commit_count: 2,
                        }
                    ]
                }),
                headers: {
                    "content-type": "application/json"
                  },
                isBase64Encoded: false
            });
        });
        test('returns statusCode 400 and message when queryStringParameters is not defined', async () => {
            const event: any = {
                requestContext: { requestId: '6cd0ee77-1564-4bba-862e-849756b5db53'},
                queryStringParameters: { gitHubRepo: 'agenda/agenda' }
            }
            event.queryStringParameters = undefined;
            const result = await main(event, context)
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    message: "Request requires queryStringParamter gitHubRepo in owner/repo format.",
                    results: null
                }),
                headers: {
                    "content-type": "application/json"
                  },
                isBase64Encoded: false
            });
        });
        test('returns statusCode 400 and message when gitHubRepo is not defined', async () => {
            const event: any = {
                requestContext: { requestId: '6cd0ee77-1564-4bba-862e-849756b5db53'},
                queryStringParameters: { gitHubRepo: 'agenda/agenda' }
            }
            event.queryStringParameters = {};
            const result = await main(event, context)
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    message: "Request requires queryStringParamter gitHubRepo in owner/repo format.",
                    results: null
                }),
                headers: {
                    "content-type": "application/json"
                  },
                isBase64Encoded: false
            });
        });
    });
    describe('Failure', () => {
        beforeEach(() => {
            _axios.get = failureMock.mockResolvedValueOnce({
                data: [
                    {
                        id: 123,
                        number: 891211,
                        title: 'Hello Wolrd',
                        user: {
                            login: 'meddy672'
                        },
                        state: 'open'
                    }
                ]
            }).mockRejectedValueOnce({
                data: [
                    {
                        status: 'Rejected commit',
                    },
                    {
                        status: 'Antoher rejected commit'
                    }
                ]
            })
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test('returns statusCode 500', async () => {
            const event: any = {
                requestContext: { requestId: '6cd0ee77-1564-4bba-862e-849756b5db53'},
                queryStringParameters: { gitHubRepo: 'agenda/agenda' }
            }
            const result = await main(event, context);
            expect(result).toEqual({
                statusCode: 500,
                body: JSON.stringify({
                    message: "Unable to process request",
                    results: null
                }),
                headers: {
                    "content-type": "application/json"
                  },
                isBase64Encoded: false
            })
        });
    });

    describe('No Open Pull Request', () => {
        beforeEach(() => {
            _axios.get = noPRMock.mockResolvedValueOnce({
                data: []
            })
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        
        test('returns statusCode 200 with correct message', async () => {
            const event: any = {
                requestContext: { requestId: '6cd0ee77-1564-4bba-862e-849756b5db53'},
                queryStringParameters: { gitHubRepo: 'agenda/agenda' }
            }
            const result = await main(event, context);
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    message: "No open pull request for repository",
                    results: []
                }),
                headers: {
                    "content-type": "application/json"
                  },
                isBase64Encoded: false
            })
        });
    });
})