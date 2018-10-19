import { IMultiLangValue } from '@app/interfaces/multilang-value';
import { IPosition } from '@app/interfaces/position';

export interface ISaveEventApiFormat {
  // Basic details
  name: IMultiLangValue;
  short_description: IMultiLangValue;
  description: IMultiLangValue;

  // Provider
  provider_contact_name: string;
  provider_contact_phone: string;
  provider_contact_email: string;
  provider_name: string;
  provider_phone: string;
  provider_email: string;
  provider_link: string;

  tickets_info: IMultiLangValue;

  event_status: string;
  publication_status: string;

  // Location
  location: {
    id: string;
    name: IMultiLangValue;
    '@id': string;
  };
  location_extra_info: IMultiLangValue;

  position: IPosition;

  // Price details
  offers: any[];

  // Images
  images: any[];

  // Keywords
  keywords: any[];
  audience: any[];

  start_time: Date;
  end_time: Date;
}
