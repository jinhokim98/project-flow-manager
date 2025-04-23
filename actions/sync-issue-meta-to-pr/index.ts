import {getInput, info, setFailed} from '@actions/core';
import {context, getOctokit} from '@actions/github';
import {extractIssueNumberFromBranch} from '../utils/extractIssueNumberFromBranch';
import {copyMetaFromIssueToPR} from '../utils/copyMetaFromIssueToPR';
import {addIssueToProject} from '../utils/addIssueToProject';
import {updateStatusField} from '../utils/updateStatusField';
import {getIssueNodeId, getPullRequestNodeId} from '../utils/getNodeId';
import {getProjectMetadata} from '../utils/getProjectMetadata';

async function run() {
  try {
    const token = getInput('github_token');
    const projectOwner = getInput('project_owner');
    const projectNumber = parseInt(getInput('project_number'), 10);
    const targetColumn = getInput('target_column');

    const octokit = getOctokit(token);
    const repositoryOwner = context.repo.owner;
    const repositoryName = context.repo.repo;
    const issueNumber = extractIssueNumberFromBranch(context.payload.pull_request?.head.ref);
    const prNumber = context.payload.pull_request?.number;

    if (!prNumber) {
      throw new Error('이 워크플로우는 PR 이벤트에서만 실행되어야 합니다.');
    }

    // 1. label과 milestone을 이슈에서 PR로 복사
    await copyMetaFromIssueToPR(octokit, repositoryOwner, repositoryName, issueNumber, prNumber);

    // 2. 프로젝트 사용 준비 (이슈 등록 및 특정 칼럼 id 가져오기 위한 과정)
    const {projectId, fieldId, statusOptionId} = await getProjectMetadata(
      octokit,
      token,
      projectOwner,
      projectNumber,
      targetColumn,
    );

    // 3. pr을 프로젝트에 등록하고 특정 칼럼으로 업데이트
    const prNodeId = await getPullRequestNodeId(octokit, prNumber);
    const prItemId = await addIssueToProject(octokit, token, projectId, prNodeId);
    await updateStatusField(octokit, token, projectId, prItemId, fieldId, statusOptionId);

    // 4. 이슈를 프로젝트에 등록(이미 등록되어있어도 가능)하고 특정 칼럼으로 업데이트
    const issueNodeId = await getIssueNodeId(octokit, issueNumber);
    const issueItemId = await addIssueToProject(octokit, token, projectId, issueNodeId);
    await updateStatusField(octokit, token, projectId, issueItemId, fieldId, statusOptionId);

    info(
      `이슈 #${issueNumber}와 관련 PR #${prNumber}가 프로젝트에 추가되었으며, 상태가 '${targetColumn}'로 설정되었습니다.`,
    );
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
