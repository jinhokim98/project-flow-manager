export default async function getStatusOptionId(octokit, statusFieldId, targetColumn) {
  const query = `
    query($fieldId: ID!) {
      node(id: $fieldId) {
        ... on ProjectV2SingleSelectField {
          options {
            id
            name
          }
        }
      }
    }
  `;

  const response = await octokit.graphql(query, {
    fieldId: statusFieldId,
    headers: {
      authorization: `Bearer ${core.getInput("github-token")}`,
    },
  });

  const option = response.node.options.find((opt) => opt.name.toLowerCase() === targetColumn.toLowerCase());

  if (!option) {
    throw new Error(`${targetColumn} 옵션을 찾을 수 없습니다.`);
  }

  return option.id;
}
