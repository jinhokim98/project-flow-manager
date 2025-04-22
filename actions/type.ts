import {GitHub} from '@actions/github/lib/utils';

export type OctokitType = InstanceType<typeof GitHub>;

export type SingleSelectOption = {
  id: string;
  name: string;
};
