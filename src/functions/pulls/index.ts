
import { handlerPath } from '@libs/handlerResolver';
/**
 * pullrequest lambda configuration 
 */
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatementsName: 'ssm-get-params-role',
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["ssm:GetParameter"],
      Resource: 'arn:aws:ssm:${env:REGION}:${env:ACCOUNT}:*'
    }
  ],
  events: [
    {
      http: {
        method: 'get',
        path: 'github/pullrequest',
        cors: true,
        caching: { enabled: true },
        request: {
          parameters: {
            querystrings: {
              gitHubRepo: true
            }
          }
        }
      }
    }
  ]
}
