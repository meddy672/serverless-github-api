export interface PullRequest {
    url: string;
    id: number;
    node_id: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    issue_url: string;
    number: number;
    state: string;
    locked: boolean;
    title: string;
    user: {
      login: string;
    };
    body: {};
    created_at: string;
    updated_at: string,
    closed_at: string | null;
    merged_at: string | null;
    merge_commit_sha: string;
    assignee: string | null;
    assignees: [];
    requested_reviewers: [];
    requested_teams: [];
    labels: [];
    milestone: null;
    draft: boolean;
    commits_url: string;
    review_comments_url: string;
    review_comment_url: string;
    comments_url: string;
    statuses_url: string;
    head: {};
    base: {};
    _links: {};
    auto_merge: null;
    active_lock_reason: null
  }
  
  export interface OpenPullRequest {
    id: number,
    number: number;
    title: string;
    author: string;
    commit_count: number
  }

  export interface Body {
    message: string;
    results: [] | OpenPullRequest[]
  }

  export interface ApiConfig {
    url: string,
    config: {}
  }

  export interface Logger {
    info: (...arg: any) => {};
    warn: (...arg: any) => {};
    error: (...arg: any) => {};
  }