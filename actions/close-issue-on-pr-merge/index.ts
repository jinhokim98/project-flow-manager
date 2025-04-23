import {getInput, info, setFailed} from '@actions/core';
import {context, getOctokit} from '@actions/github';
import {extractIssueNumberFromBranch} from '../utils/extractIssueNumberFromBranch';

async function run() {
  try {
    const token = getInput('github_token');
    const octokit = getOctokit(token);
    const issueNumber = extractIssueNumberFromBranch(context.payload.pull_request?.head.ref);

    const {owner, repo} = context.repo;
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    });

    info(`이슈 #${issueNumber}가 PR 머지로 인해 Close 되었습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      setFailed(`이슈 닫기 실패: ${err.message}`);
    }
  }
}

run();
