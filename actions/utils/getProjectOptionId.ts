import {SingleSelectOption} from '../type';

export function getProjectOptionId(options: SingleSelectOption[], targetColumn: string) {
  const option = options.find(opt => opt.name === targetColumn);

  if (!option) {
    throw new Error(`'${targetColumn}' 상태 옵션을 찾을 수 없습니다.`);
  }

  return option.id;
}
