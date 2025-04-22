const core = require("@actions/core");

export default async function getProjectId(octokit, projectType) {
  const projectNumber = parseInt(core.getInput("project_number"));

  const query = `
  query($login: String!, $number: Int!) {
    ${projectType === "Organization" ? "organization" : "user"}(login: $login) {
      projectV2(number: $number) {
        id
      }
    }
  }
`;

  const response = await octokit.graphql(query, {
    login: owner,
    number: projectNumber,
    headers: { authorization: `Bearer ${core.getInput("github_token")}` },
  });

  return projectType === "Organization" ? response.organization.projectV2.id : response.user.projectV2.id;
}
