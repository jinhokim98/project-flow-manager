const core = require("@actions/core");

export default async function getStatusFieldId(octokit, projectId) {
  const query = `
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 50) {
            nodes {
              id
              name
              dataType
            }
          }
        }
      }
    }
  `;

  const response = await octokit.graphql(query, {
    projectId,
    headers: {
      authorization: `Bearer ${core.getInput("github_token")}`,
    },
  });

  const fields = response.node.fields.nodes;
  const statusField = fields.find((field) => field.name === "Status");

  if (!statusField) {
    throw new Error("'Status' 필드를 찾을 수 없습니다.");
  }

  return statusField.id;
}
