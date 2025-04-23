import {OctokitType} from '../type';

export async function copyMetaFromIssueToPR(
  octokit: OctokitType,
  owner: string,
  repo: string,
  issueNumber: number,
  prNumber: number,
) {
  const {data: issue} = await octokit.request(`GET /repos/{owner}/{repo}/issues/{issue_number}`, {
    owner,
    repo,
    issue_number: issueNumber,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  // 이슈에 label이 있거나 milestone이 설정되어 있는 경우에 PR에 label과 milestone을 설정합니다.
  if (issue.labels.length || issue.milestone !== null) {
    const labelNames = issue.labels
      ?.map(label => (typeof label === 'string' ? label : label.name ?? ''))
      .filter(Boolean);

    const milestone = issue.milestone?.number ?? null;

    await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
      owner,
      repo,
      issue_number: prNumber,
      milestone,
      state: 'open',
      labels: labelNames,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }
}
