
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
      Resource: `arn:aws:ssm:us-east-1:275855030009:*`
    }
  ],
  events: [
    {
      http: {
        method: 'get',
        path: 'github/pullrequest',
        cors: true,
        caching: { enabled: true},
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
