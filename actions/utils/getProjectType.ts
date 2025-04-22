import {OctokitType} from '../type';

export async function getProjectType(octokit: OctokitType, projectOwner: string) {
  const res = await octokit.rest.users.getByUsername({username: projectOwner});
  return res.data.type; // "User" or "Organization"
}
