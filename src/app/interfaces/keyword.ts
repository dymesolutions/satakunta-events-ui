import { IImage } from '@app/interfaces/image';
import { IMultiLangValue } from '@app/interfaces/multilang-value';

export interface IKeyword {
  id: string;
  alt_labels: any[];
  created_time: Date;
  last_modified_time: Date;
  aggregate: boolean;
  deprecated: boolean;
  n_events: number;
  data_source: string;
  image: IImage;
  publisher: string;
  name: IMultiLangValue;

  '@id': string;
  '@context': string;
  '@type': string;
}
