import {getInput, info, setFailed} from '@actions/core';
import {context, getOctokit} from '@actions/github';

import {getProjectId} from '../utils/getProjectId';
import {getProjectFieldId} from '../utils/getProjectFieldId';
import {getProjectOptionId} from '../utils/getProjectOptionId';
import {updateStatusField} from '../utils/updateStatusField';
import {addIssueToProject} from '../utils/addIssueToProject';

async function run() {
  try {
    const token = getInput('github_token');
    const projectOwner = getInput('project_owner');
    const projectNumber = parseInt(getInput('project_number'));
    const targetColumn = getInput('target_column');

    const octokit = getOctokit(token);

    // refs/heads/feature/123-add-logic 같은 브랜치 이름에서 123을 추출
    const branchName = context.ref.replace('refs/heads/', '');
    const issueNumberMatch = branchName.match(/(\d+)/);

    if (!issueNumberMatch) {
      throw new Error('브랜치 이름에서 이슈 번호를 추출할 수 없습니다.');
    }

    const issueNumber = parseInt(issueNumberMatch[1]);

    const {data: issue} = await octokit.rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
    });

    // target column id를 얻어오는 과정
    const projectId = await getProjectId(octokit, token, projectOwner, projectNumber);
    const {fieldId, options} = await getProjectFieldId(octokit, token, projectId);
    const statusOptionId = getProjectOptionId(options, targetColumn);

    // 이슈 item id를 얻어옴 -> 이미 프로젝트에 등록되어있으면 그 id를 반환하기 때문에 addIssueToProject를 호출해도 무방
    const itemId = await addIssueToProject(octokit, token, projectId, issue.node_id);

    // 이슈 상태를 특정 상태로 업데이트
    await updateStatusField(octokit, token, projectId, itemId, fieldId, statusOptionId);

    info(`이슈 #${issueNumber}가 '${targetColumn}' 상태로 이동되었습니다.`);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
