const core = require("@actions/core");

async function getProjectFieldId(octokit, projectId) {
  const query = `
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 50) {
            nodes {
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
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
  const specificField = fields.find((field) => field.name === "Status");

  if (!specificField) {
    throw new Error("'Status' 필드를 찾을 수 없습니다.");
  }

  return {
    fieldId: specificField.id,
    options: specificField.options,
  };
}

module.exports = getProjectFieldId;
