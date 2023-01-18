import * as _ from 'lodash';

const APP_ROOT = '../../src/';

const viaHandler = async (event, context, functionName) => {
    const handler = require(`${APP_ROOT}/functions/pulls/${functionName}`).main
  
    const response = await handler(event, context);
    const contentType = _.get(response, 'headers.Content-Type', 'application/json');
    if (response.body && contentType === 'application/json') {
      response.body = JSON.parse(response.body);
    }
    return response
}

const we_invoke_get_pull_request = async (event, context) => await viaHandler(event, context, 'handler');

const when = {
    we_invoke_get_pull_request
}

export default when;