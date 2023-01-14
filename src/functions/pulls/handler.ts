import { middyfy } from './lambda';
import { createLogger } from '../../libs/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import { handleOpenPullRequestEvent } from './handlePullRequestEvent';
import { metricScope, Unit } from 'aws-embedded-metrics';

const logger = createLogger('OpenPullRequestLambda');

/**
 * handler for open pull request
 * @param event - APIGatewayProxyEvent
 * @returns Promise<Response>
 */
const pullRequest: Handler =  metricScope( metrics => async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  logger.info('Incomming Event:', event);

  metrics.setNamespace('OpenPullRequestLambda');
  metrics.putDimensions({ Service: 'get-open-pull-request'});

  const start = Date.now();
  const results = await handleOpenPullRequestEvent(event, logger);
  const end = Date.now();

  metrics.putMetric("latency", end - start, Unit.Milliseconds);
  metrics.putMetric("count", results.body.length, Unit.Count);
  metrics.setProperty("RequestId", context.awsRequestId);
  metrics.setProperty("ApiGatewayRequestId", event.requestContext.requestId);

  return results;
})


export const main = middyfy(pullRequest);
