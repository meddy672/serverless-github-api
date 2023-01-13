import { Body } from "../../models/interfaces/pulls.interface";
import { APIGatewayProxyResult } from 'aws-lambda'

/**
 * Formats the response for api gateway
 * @param statusCode - http status code
 * @param responseBody - response from open pull request
 * @returns APIProroxy response for api gateway
 */
export const formatResponse = ( statusCode: number, responseBody: Body ): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(responseBody),
    headers: {
      "content-type": "application/json"
    },
    isBase64Encoded: false
  }
}
