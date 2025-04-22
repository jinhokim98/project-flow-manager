import {getInput, setFailed, info} from '@actions/core';
import {getOctokit, context} from '@actions/github';

import {getProjectType} from '../utils/getProjectType';
import {getProjectId} from '../utils/getProjectId';
import {addIssueToProject} from '../utils/addIssueToProject';
import {getProjectFieldId} from '../utils/getProjectFieldId';
import {getProjectOptionId} from '../utils/getProjectOptionId';
import {updateStatusField} from '../utils/updateStatusField';

async function run() {
  try {
    const token = getInput('github_token');
    const octokit = getOctokit(token);
    const targetColumn = getInput('target_column') ?? 'Todo';

    const issueId = context.payload.issue?.node_id;
    const projectOwner = getInput('project_owner');

    // 1. project가 user인지 organization인지 확인
    const projectType = await getProjectType(octokit, projectOwner);

    // 2. 프로젝트 ID 가져오기
    const projectId = await getProjectId(octokit, projectType);

    // 3. 이슈를 프로젝트에 등록
    const itemId = await addIssueToProject(octokit, projectId, issueId);

    // 4. Status 필드 ID 가져오기
    const {fieldId, options} = await getProjectFieldId(octokit, projectId);

    // 5. Status Option ID 가져오기
    const statusOptionId = getProjectOptionId(options, targetColumn);

    // 6. Status를 target column으로 설정
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
