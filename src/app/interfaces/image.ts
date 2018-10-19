import { IMultiLangValue } from '@app/interfaces/multilang-value';

export interface IImage {
  '@id': string;
  id: number;
  url: string;
  name: string;
  photographer_name: string;
  license: string;
}
