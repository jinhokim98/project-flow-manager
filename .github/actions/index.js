const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  const token = core.getInput("github_token");
  const octokit = github.getOctokit(token);
  const context = github.context;

  if (context.eventName !== "issues" || context.payload.action !== "opened") {
    core.info("Not an issue opened event, skipping.");
    return;
  }

  const issue = context.payload.issue;
  core.info(`New issue created: ${issue.title}`);

  // 여기에 Project 등록 & status 설정 코드가 들어갈 예정
}

run();
