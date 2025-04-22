const core = require("@actions/core");

export default async function getProjectId(octokit, ownerType) {
  const projectNumber = parseInt(core.getInput("project_number"));

  const query = `
  query($login: String!, $number: Int!) {
    ${ownerType === "Organization" ? "organization" : "user"}(login: $login) {
      projectV2(number: $number) {
        id
      }
    }
  }
`;

  const response = await octokit.graphql(query, {
    login: owner,
    number: projectNumber,
    headers: { authorization: `Bearer ${core.getInput("github-token")}` },
  });

  return ownerType === "Organization" ? response.organization.projectV2.id : response.user.projectV2.id;
}
