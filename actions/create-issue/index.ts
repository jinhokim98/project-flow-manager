import {getInput, setFailed, info} from '@actions/core';
import {getOctokit, context} from '@actions/github';

import {getProjectId} from '../utils/getProjectId';
import {addIssueToProject} from '../utils/addIssueToProject';
import {getProjectFieldId} from '../utils/getProjectFieldId';
import {getProjectOptionId} from '../utils/getProjectOptionId';
import {updateStatusField} from '../utils/updateStatusField';

async function run() {
  try {
    const token = getInput('github_token');
    const targetColumn = getInput('target_column');
    const projectOwner = getInput('project_owner');
    const projectNumber = parseInt(getInput('project_number'), 10);

    const octokit = getOctokit(token);
    const issueId = context.payload.issue?.node_id;

    // 1. 프로젝트 ID 가져오기
    const projectId = await getProjectId(octokit, projectOwner, projectNumber);

    // 2. 이슈를 프로젝트에 등록
    const itemId = await addIssueToProject(octokit, projectId, issueId);

    // 3. Status 필드 ID 가져오기
    const {fieldId, options} = await getProjectFieldId(octokit, projectId);

    // 4. Status Option ID 가져오기
    const statusOptionId = getProjectOptionId(options, targetColumn);

    // 5. Status를 target column으로 설정
    await updateStatusField(octokit, projectId, itemId, fieldId, statusOptionId);

    info(`이슈가 프로젝트에 등록되고 ${targetColumn}로 설정되었습니다.`);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('Unknown error occurred');
    }
  }
}

run();
