async function getProjectOptionId(options, targetColumn) {
  const option = options.find((opt) => opt.name === targetColumn);
  if (!option) {
    throw new Error(`'${targetColumn}' 상태 옵션을 찾을 수 없습니다.`);
  }
  return option.id;
}

module.exports = getProjectOptionId;
