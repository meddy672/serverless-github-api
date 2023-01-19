import * as _ from 'lodash';
import http from '../../src/libs/axios';
import { formatResponse } from '../../src/libs/apiGateway';
require('dotenv').config();

const APP_ROOT = '../../src/';
const mode = process.env.TEST_MODE;

const viaHandler = async (event, context, functionName) => {
    const handler = require(`${APP_ROOT}/functions/pulls/${functionName}`).main
  
    const response = await handler(event, context);
    const contentType = _.get(response, 'headers.Content-Type', 'application/json');
    if (response.body && contentType === 'application/json') {
      response.body = JSON.parse(response.body);
    }
    return response
}

const viaHttp = async (event) => {
  const gitHubRepo = event.queryStringParameters.gitHubRepo;
  const url = `${process.env.API_URL}?gitHubRepo=${gitHubRepo}`;

  try {

    const { data } = await http.get(url);
    return formatResponse(200, {
      message: data.message,
      results: data.results
    });

  } catch (err) {
    if (err.status) {
      return {
        statusCode: err.status,
        headers: err.response.headers
      }
    } else {
      throw err
    }
  }
}

const we_invoke_get_pull_request = async (event, context) => {
  let response: any;

  switch(mode) {
    case 'handler':
      response = await viaHandler(event, context, 'handler');
      break;
    case 'http':
      response = await viaHttp(event)
      break;
    default:
      throw new Error('Mode not recognized')
  }

  return response
};

const when = {
    we_invoke_get_pull_request
}

export default when;