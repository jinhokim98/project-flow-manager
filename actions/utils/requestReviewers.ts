import {OctokitType} from '../type';
import {info, warning} from '@actions/core';

export async function requestReviewers(
  octokit: OctokitType,
  owner: string,
  repo: string,
  prNumber: number,
  reviewers: string[],
  teamReviewers: string[],
) {
  if (reviewers.length === 0 && teamReviewers.length === 0) {
    info('리뷰어가 지정되지 않았습니다.');
    return;
  }

  try {
    await octokit.rest.pulls.requestReviewers({
      owner,
      repo,
      pull_number: prNumber,
      reviewers,
      team_reviewers: teamReviewers,
    });
    info(`리뷰어 등록 성공: 개인 (${reviewers.join(', ')}) 팀 (${teamReviewers.join(', ')})`);
  } catch (err) {
    if (err instanceof Error) {
      warning(`리뷰어 등록 실패: ${err.message}`);
    }
  }
}
