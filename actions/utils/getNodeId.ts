import {OctokitType} from '../type';
import {context} from '@actions/github';

export async function getIssueNodeId(octokit: OctokitType, issueNumber: number) {
  const {data: issue} = await octokit.rest.issues.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
  });

  return issue.node_id;
}

export async function getPullRequestNodeId(octokit: OctokitType, pullRequestNumber: number) {
  const {data: pullRequest} = await octokit.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullRequestNumber,
  });

  return pullRequest.node_id;
}
