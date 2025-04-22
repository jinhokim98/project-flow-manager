const core = require("@actions/core");

export default async function updateStatusField(octokit, projectId, itemId, fieldId, optionId) {
  const mutation = `
    mutation($input: UpdateProjectV2ItemFieldValueInput!) {
      updateProjectV2ItemFieldValue(input: $input) {
        projectV2Item {
          id
        }
      }
    }
  `;

  const variables = {
    input: {
      projectId,
      itemId,
      fieldId,
      value: {
        singleSelectOptionId: optionId,
      },
    },
  };

  const response = await octokit.graphql(mutation, {
    ...variables,
    headers: {
      authorization: `Bearer ${core.getInput("github_token")}`,
    },
  });

  return response.updateProjectV2ItemFieldValue.projectV2Item.id;
}
