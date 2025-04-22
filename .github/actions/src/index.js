const core = require("@actions/core");
const github = require("@actions/github");

const getProjectId = require("./getProjectId");
const addIssueToProject = require("./addIssueToProject");
const getStatusFieldId = require("./getStatusFieldId");
const getStatusOptionId = require("./getStatusOptionId");
const updateStatusField = require("./updateStatusField");

async function resolveProjectType(octokit, projectName) {
  const res = await octokit.rest.users.getByUsername({ username: projectName });
  return res.data.type; // "User" or "Organization"
}

async function run() {
  try {
    const token = core.getInput("github_token");
    const octokit = github.getOctokit(token);
    const context = github.context;
    const targetColumn = core.getInput("target_column") ?? "Todo";

    const issueId = context.payload.issue.node_id;
    const projectName = core.getInput("project_name");

    // 1. project가 user인지 organization인지 확인
    const projectType = await resolveProjectType(octokit, projectName);

    // 2. 프로젝트 ID 가져오기
    const projectId = await getProjectId(octokit, projectType);

    // 3. 이슈를 프로젝트에 등록
    const itemId = await addIssueToProject(octokit, projectId, issueId);

    // 4. Status 필드 ID 가져오기
    const fieldId = await getStatusFieldId(octokit, projectId);

    // 5. Status Option ID 가져오기
    const statusOptionId = await getStatusOptionId(octokit, fieldId, targetColumn);

    // 6. Status를 target column으로 설정
    await updateStatusField(octokit, projectId, itemId, fieldId, statusOptionId);

    core.info(`이슈가 프로젝트에 등록되고 ${targetColumn}로 설정되었습니다.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
