import {OctokitType} from '../type';

type AddIssueToProjectResponse = {
  addProjectV2ItemById: {
    item: {
      id: string;
    };
  };
};

export async function addIssueToProject(
  octokit: OctokitType,
  token: string,
  projectId: string,
  issueNodeId: string,
): Promise<string> {
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

  const response = await octokit.graphql<AddIssueToProjectResponse>(mutation, {
    projectId,
    contentId: issueNodeId,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response.addProjectV2ItemById.item.id;
}
