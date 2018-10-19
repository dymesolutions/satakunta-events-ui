import { isMoment } from 'moment';

export class ParameterUtil {
  static createParameterString(params: any[]) {

    if (params) {
      const dateParamFormat = 'YYYY-MM-DD';

      let paramString = '';

      paramString = paramString + '?';

      let paramsStarted = false;

      params.forEach(param => {
        const key = Object.getOwnPropertyNames(param)[0];
        const value = param[key];

        if (value !== null) {
          // Start the parameter string with a question mark if at least one of the values is present
          if (!paramsStarted) {
            paramString = '?';
            paramsStarted = true;
          }

          // If parameter is a moment (start date or end date) transform it to the format the API understands
          paramString = paramString + key + '=' + (isMoment(value) ? value.format(dateParamFormat) : value) + '&';
        } else {

        }
      });

      return paramString;
    } else { return ''; }
  }
}
