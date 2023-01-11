export enum STATUS_CODES {
    OK = 200,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
}

export enum MESSAGE {
    INVALID_GITHUB_URL = 'Request requires queryStringParamter gitHubRepo in owner/repo format.',
    NO_OPEN_PULLS = 'No open pull request for repository',
    OPEN_PULLS = 'Open pull request',
    UNABLE_TO_PROCESS_REQUEST = 'Unable to process request'
}