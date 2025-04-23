import {getInput, info, setFailed} from '@actions/core';
import {context, getOctokit} from '@actions/github';

import {updateStatusField} from '../utils/updateStatusField';
import {addIssueToProject} from '../utils/addIssueToProject';
import {getProjectMetadata} from '../utils/getProjectMetadata';
import {extractIssueNumberFromBranch} from '../utils/extractIssueNumberFromBranch';

async function run() {
  try {
    const token = getInput('github_token');
    const projectOwner = getInput('project_owner');
    const projectNumber = parseInt(getInput('project_number'), 10);
    const targetColumn = getInput('target_column');

    const octokit = getOctokit(token);

    // 1. 이슈 번호를 브랜치 이름에서 추출
    const issueNumber = extractIssueNumberFromBranch(context.ref);
    const {data: issue} = await octokit.rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
    });

    // 2. projectId, fieldId, statusOptionId을 가져오는 과정
    const {projectId, fieldId, statusOptionId} = await getProjectMetadata(
      octokit,
      token,
      projectOwner,
      projectNumber,
      targetColumn,
    );

    // 3. 이슈 item id를 얻어옴 -> 이미 프로젝트에 등록되어있으면 그 id를 반환하기 때문에 addIssueToProject를 호출해도 무방
    const itemId = await addIssueToProject(octokit, token, projectId, issue.node_id);

    // 4. 이슈 상태를 특정 상태로 업데이트
    await updateStatusField(octokit, token, projectId, itemId, fieldId, statusOptionId);

    info(`이슈 #${issueNumber}가 '${targetColumn}' 상태로 이동되었습니다.`);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
