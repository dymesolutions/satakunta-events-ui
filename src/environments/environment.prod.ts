import * as moment from 'moment';
import { prodConfig } from '../../config/prod';

export const environment = {
  production: true,
  config: prodConfig,
  build: moment().format('YYYYMMDDHHmmssSSS').toString()
};
