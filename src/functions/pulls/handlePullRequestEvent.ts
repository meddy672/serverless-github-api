import http from '../../libs/axios';
import { ssm } from '../../libs/ssmClient';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatResponse } from '../../libs/apiGateway';
import { OpenPullRequest, PullRequest, Logger, ApiConfig } from '../../../models/interfaces/pulls.interface';
import { STATUS_CODES, MESSAGE } from '../../libs/enums';



/**
 * Get open pull request from a GitHub Repository
 * Requires event.queryStringParameters.gitHubRepo
 * @param event - APIGatewayProxyEvent
 * @returns Promise<Response> - satusCode and body
 */
export async function handleOpenPullRequestEvent(event: APIGatewayProxyEvent, logger: Logger): Promise<APIGatewayProxyResult> {
  
    const { gitHubRepo } = event.queryStringParameters;
    logger.info('GitHubRepo:', gitHubRepo);
  
    try {
      
      const api = await getApiConfig(gitHubRepo);
      const pullRequest = await http.get(api.url, api.config);

      if (!pullRequest.data?.length) {
        logger.warn('No Open Request For Repository');
        return formatResponse(STATUS_CODES.OK, {
          message: MESSAGE.NO_OPEN_PULLS,
          results: []
        });
      }

      logger.info('PullRequest Data:', pullRequest.data);
      const pendingCommits = pullRequest.data.map((pr: PullRequest) => http.get(pr.commits_url, api.config));
      const commits = await Promise.allSettled(pendingCommits);
  
      if (commits.find((commit) => commit.status === 'rejected')) {
        logger.error('Rejected Commits From The Request');
        throw new Error('Rejected Commits RequestError');
      }
  
      logger.info('Pull Request Commits:', commits);
      const openPullRequest = mapPullRequestToCommits(pullRequest, commits);
      logger.info('OpenPullRequest:', openPullRequest);
  
      return formatResponse(STATUS_CODES.OK, {
        message: MESSAGE.OPEN_PULLS,
        results: openPullRequest
      });

    } catch (error) {
      logger.error('Unable to process request:', error);
      return formatResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, {
        message: MESSAGE.UNABLE_TO_PROCESS_REQUEST,
        results: null
      });
    }
  }
  
  /**
   * Each PR has a one-to-one relationship with its commits via the commit_url
   * Each commit is processed in the same order as its PR.
   * @param pullRequests - Axios response with pull request data
   * @param commits - An array of settled Promises from Axios request GET /commits_url
   * @returns OpenPullRequest
   */
  function mapPullRequestToCommits(pullRequest, commits): OpenPullRequest[] {
    return pullRequest.data.map((pr: PullRequest, index: number) => {
      if (pr.state === 'open') {
        return {
          id: pr.id,
          number: pr.number,
          title: pr.title,
          author: pr.user.login,
          commit_count: commits[index].value?.data.length
        }
      }
    });
  }

/**
 * @param gitHubRepo - repository to search open pull request from
 * @returns ApiConfig - to make api calls to github api
 */
async function getApiConfig(gitHubRepo: string): Promise<ApiConfig> {

  const token = await ssm.getParameter({
    Name: "/dev/ssm/githubapi/auth-token",
    WithDecryption: true
  }).promise();

  return {
    url: `repos/${gitHubRepo}/pulls`,
    config: {
      headers: {
        'Authorization': 'Bearer ' + token.Parameter.Value
      }
    }
  }
}
