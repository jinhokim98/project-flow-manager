import {getInput, setFailed, info} from '@actions/core';
import {getOctokit, context} from '@actions/github';

import {addIssueToProject} from '../utils/addIssueToProject';
import {updateStatusField} from '../utils/updateStatusField';
import {getProjectMetadata} from '../utils/getProjectMetadata';

async function run() {
  try {
    const token = getInput('github_token');
    const targetColumn = getInput('target_column');
    const projectOwner = getInput('project_owner');
    const projectNumber = parseInt(getInput('project_number'), 10);

    const octokit = getOctokit(token);

    // 1. projectId, fieldId, statusOptionId을 가져오는 과정
    const {projectId, fieldId, statusOptionId} = await getProjectMetadata(
      octokit,
      token,
      projectOwner,
      projectNumber,
      targetColumn,
    );

    // 2. 이슈를 프로젝트에 등록
    const issueId = context.payload.issue?.node_id;
    const itemId = await addIssueToProject(octokit, token, projectId, issueId);

    // 3. Status를 target column으로 설정
    await updateStatusField(octokit, token, projectId, itemId, fieldId, statusOptionId);

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
