import {getInput, setFailed} from '@actions/core';
import {context, getOctokit} from '@actions/github';
import {assignPR} from '../utils/assignPR';
import {requestReviewers} from '../utils/requestReviewers';

async function run() {
  try {
    const token = getInput('github_token');
    const octokit = getOctokit(token);
    const prNumber = context.payload.pull_request?.number;

    if (!prNumber) throw new Error('이 워크플로우는 PR 이벤트에서만 실행되어야 합니다.');

    const owner = context.repo.owner;
    const repo = context.repo.repo;

    const assignees = getInput('assignees')
      ?.split(',')
      .map(s => s.trim())
      .filter(Boolean) || [context.payload.pull_request?.user.login];
    const reviewers =
      getInput('reviewers')
        ?.split(',')
        .map(s => s.trim())
        .filter(Boolean) || [];
    const teamReviewers =
      getInput('team_reviewers')
        ?.split(',')
        .map(s => s.trim())
        .filter(Boolean) || [];

    if (assignees.length > 0) {
      await assignPR(octokit, owner, repo, prNumber, assignees);
    }

    if (reviewers.length > 0 || teamReviewers.length > 0) {
      await requestReviewers(octokit, owner, repo, prNumber, reviewers, teamReviewers);
    }
  } catch (err) {
    if (err instanceof Error) setFailed(err.message);
  }
}

run();
