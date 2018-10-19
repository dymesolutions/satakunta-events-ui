import { IMultiLangValue } from '@app/interfaces/multilang-value';

export interface IOffer {
  is_free: boolean;
  price: IMultiLangValue;
  info_url: IMultiLangValue;
  description: IMultiLangValue;
}
