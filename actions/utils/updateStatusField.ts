import {getInput} from '@actions/core';
import {OctokitType} from '../type';

export async function updateStatusField(
  octokit: OctokitType,
  projectId: string,
  itemId: string,
  fieldId: string,
  optionId: string,
): Promise<string> {
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

  const response = await octokit.graphql<{
    updateProjectV2ItemFieldValue: {
      projectV2Item: {id: string};
    };
  }>(mutation, {
    ...variables,
    headers: {
      authorization: `Bearer ${getInput('github_token')}`,
    },
  });

  return response.updateProjectV2ItemFieldValue.projectV2Item.id;
}
