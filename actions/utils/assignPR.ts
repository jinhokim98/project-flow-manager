import {info, warning} from '@actions/core';
import {OctokitType} from '../type';

export async function assignPR(
  octokit: OctokitType,
  owner: string,
  repo: string,
  prNumber: number,
  assignees: string[],
) {
  try {
    await octokit.rest.issues.addAssignees({
      owner,
      repo,
      issue_number: prNumber,
      assignees,
    });
    info(`Assignee 지정 완료: ${assignees.join(', ')}`);
  } catch (err) {
    if (err instanceof Error) {
      warning(`Assignee 지정 실패: ${err.message}`);
      return;
    }
  }
}
