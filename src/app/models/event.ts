import { IImage } from '@app/interfaces/image';
import { IMultiLangValue } from '@app/interfaces/multilang-value';
import { ILocation } from '@app/interfaces/location';
import { Place } from '@app/models/place';
import { IPosition } from '@app/interfaces/position';
import { Moment } from 'moment';

export class Event {
  id: string;
  name: IMultiLangValue;
  shortDescription: IMultiLangValue;
  description: IMultiLangValue;
  images: any[];
  location: ILocation;

  startTime: Moment;
  endTime: Moment;

  provider: {
    name: string;
    phone: string;
    email: string;
    link: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  };

  eventStatus: string;
  publicationStatus: string;

  keywords: any[];
  audiences: any[];

  offers: any[];

  position: IPosition;

  constructor() {
    this.id = '';
    this.name = {
      fi: '',
      sv: '',
      en: ''
    };

    this.shortDescription = {
      fi: '',
      sv: '',
      en: ''
    };

    this.description = {
      fi: '',
      sv: '',
      en: ''
    };

    this.images = [];

    this.location = {
      place: new Place,
      extraInfo: '',
      position: {
        lat: null,
        lng: null
      }
    };

    this.provider = {
      name: '',
      phone: '',
      email: '',
      link: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    };

    this.publicationStatus = 'public';
    this.eventStatus = 'EventScheduled';
  }
}
