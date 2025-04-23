// refs/heads/feature/123-add-logic 같은 브랜치 이름에서 123을 추출
export function extractIssueNumberFromBranch(ref: string) {
  const branchName = ref.replace('refs/heads/', '');
  const issueNumberMatch = branchName.match(/(\d+)/);

  if (!issueNumberMatch) {
    throw new Error('브랜치 이름에서 이슈 번호를 추출할 수 없습니다.');
  }

  const issueNumber = parseInt(issueNumberMatch[1]);
  return issueNumber;
}
