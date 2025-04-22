const core = require("@actions/core");

export default async function addIssueToProject(octokit, projectId, issueNodeId) {
  const mutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {
        projectId: $projectId
        contentId: $contentId
      }) {
        item {
          id
        }
      }
    }
  `;

  const response = await octokit.graphql(mutation, {
    projectId,
    contentId: issueNodeId,
    headers: {
      authorization: `Bearer ${core.getInput("github-token")}`,
    },
  });

  return response.addProjectV2ItemById.item.id;
}
