import {getInput} from '@actions/core';
import {OctokitType} from '../type';

type OrganizationProjectResponse = {
  organization: {
    projectV2: {
      id: string;
    };
  };
};

type UserProjectResponse = {
  user: {
    projectV2: {
      id: string;
    };
  };
};

type ProjectIdResponse = OrganizationProjectResponse | UserProjectResponse;

export async function getProjectId(octokit: OctokitType, projectType: string) {
  const projectOwner = getInput('project_owner');
  const projectNumber = parseInt(getInput('project_number'));

  const query = `
    query($login: String!, $number: Int!) {
      ${projectType === 'Organization' ? 'organization' : 'user'}(login: $login) {
        projectV2(number: $number) {
          id
        }
      }
    }
  `;

  const response = await octokit.graphql<ProjectIdResponse>(query, {
    login: projectOwner,
    number: projectNumber,
    headers: {
      authorization: `Bearer ${getInput('github_token')}`,
    },
  });

  if ('organization' in response && response.organization?.projectV2?.id) {
    return response.organization.projectV2.id;
  }

  if ('user' in response && response.user?.projectV2?.id) {
    return response.user.projectV2.id;
  }

  throw new Error('Project ID를 찾을 수 없습니다.');
}
