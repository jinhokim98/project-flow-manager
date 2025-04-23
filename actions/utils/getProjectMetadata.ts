import {OctokitType} from '../type';
import {getProjectFieldId} from './getProjectFieldId';
import {getProjectId} from './getProjectId';
import {getProjectOptionId} from './getProjectOptionId';

export async function getProjectMetadata(
  octokit: OctokitType,
  token: string,
  projectOwner: string,
  projectNumber: number,
  targetColumn: string,
) {
  const projectId = await getProjectId(octokit, token, projectOwner, projectNumber);
  const {fieldId, options} = await getProjectFieldId(octokit, token, projectId);
  const statusOptionId = getProjectOptionId(options, targetColumn);

  return {projectId, fieldId, statusOptionId};
}
