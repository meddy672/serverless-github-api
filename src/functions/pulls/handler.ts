import { middyfy } from '../../libs/lambda';
import { createLogger } from '../../libs/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { handleOpenPullRequestEvent } from './handlePullRequestEvent';

const logger = createLogger('OpenPullRequestLambda');

/**
 * handler for open pull request
 * @param event - APIGatewayProxyEvent
 * @returns Promise<Response>
 */
const pullRequest: Handler = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Incomming Event:', event);
  return handleOpenPullRequestEvent(event, logger);
}

export const main = middyfy(pullRequest);
