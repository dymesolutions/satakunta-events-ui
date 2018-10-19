import { Pipe, PipeTransform } from '@angular/core';
import { TransformType } from '@app/enums/transform-type';
import { ISaveEventApiFormat } from '@app/interfaces/save-event-api-format';
import { Event } from '@app/models/event';
import { environment } from 'environments/environment';

@Pipe({
  name: 'apiData'
})
export class ApiDataPipe implements PipeTransform {

  private transformKeywordsToAPIFormat(keywords: any[]) {
    return keywords.map(keyword => {
      return {
        '@id': `${environment.config.url.LEApiBaseUrl}keyword/${keyword.id}/`
      };
    });
  }

  private transformOffersToAPIFormat(offers: any[]) {
    return offers.map(offer => {
      return {
        is_free: offer.isFree,
        price: offer.price ? offer.price : null,
        info_url: offer.info_url ? offer.info_url : null,
        description: offer.description ? offer.description : null
      };
    });
  }

  private transformEventToUIFormat(event: any): Event {
    const eventInUIFormat = new Event();

    if (event.id !== null && event.id !== undefined) {
      eventInUIFormat.id = event.id;
    }

    // Name
    if (event.name !== null && event.name !== undefined) {
      if (event.name.fi !== null && event.name.fi !== undefined) {
        eventInUIFormat.name.fi = event.name.fi;
      }

      if (event.name.sv !== null && event.name.sv !== undefined) {
        eventInUIFormat.name.sv = event.name.sv;
      }

      if (event.name.en !== null && event.name.en !== undefined) {
        eventInUIFormat.name.en = event.name.en;
      }
    }

    // Start time
    if (event.start_time !== null && event.start_time !== undefined) {
      eventInUIFormat.startTime = event.start_time;
    }

    // End time
    if (event.end_time !== null && event.end_time !== undefined) {
      eventInUIFormat.endTime = event.end_time;
    }

    // Short description
    if (event.short_description !== null && event.short_description !== undefined) {
      if (event.short_description.fi !== null && event.short_description.fi !== undefined) {
        eventInUIFormat.shortDescription.fi = event.short_description.fi;
      }

      if (event.short_description.sv !== null && event.short_description.sv !== undefined) {
        eventInUIFormat.shortDescription.sv = event.short_description.sv;
      }

      if (event.short_description.en !== null && event.short_description.en !== undefined) {
        eventInUIFormat.shortDescription.en = event.short_description.en;
      }
    }

    // Description
    if (event.description !== null && event.description !== undefined) {
      if (event.description.fi !== null && event.description.fi !== undefined) {
        eventInUIFormat.description.fi = event.description.fi;
      }

      if (event.description.sv !== null && event.description.sv !== undefined) {
        eventInUIFormat.shortDescription.sv = event.description.sv;
      }

      if (event.description.en !== null && event.description.en !== undefined) {
        eventInUIFormat.shortDescription.en = event.description.en;
      }
    }

    // Images
    if (event.images !== null && event.images !== undefined && event.images.length > 0) {
      eventInUIFormat.images = event.images.map(image => {
        return {
          url: image.url
        };
      });
    }

    return eventInUIFormat;
  }

  private transformEventToApiFormat(event: Event) {
    const eventInAPIFormat: ISaveEventApiFormat = {
      name: {
        fi: event.name.fi,
        sv: event.name.sv ? event.name.sv : '',
        en: event.name.en ? event.name.en : ''
      },
      short_description: {
        fi: event.shortDescription.fi ? event.shortDescription.fi : '',
        sv: event.shortDescription.sv ? event.shortDescription.sv : '',
        en: event.shortDescription.en ? event.shortDescription.en : ''
      },
      description: {
        fi: event.description.fi ? event.description.fi : '',
        sv: event.description.sv ? event.description.sv : '',
        en: event.description.en ? event.description.en : ''
      },
      provider_contact_name: event.provider.contactName ? event.provider.contactName : '',
      provider_contact_phone: event.provider.contactPhone ? event.provider.contactPhone : '',
      provider_contact_email: event.provider.contactEmail ? event.provider.contactEmail : '',
      provider_name: event.provider.name ? event.provider.name : '',
      provider_phone: event.provider.phone ? event.provider.phone : '',
      provider_email: event.provider.email ? event.provider.email : '',
      provider_link: event.provider.link ? event.provider.link : '',

      tickets_info: {
        fi: '',
        sv: '',
        en: ''
      },

      event_status: event.eventStatus ? event.eventStatus : '',
      publication_status: event.publicationStatus ? event.publicationStatus : '',

      // Location
      location: {
        id: event.location.place.id ? event.location.place.id : '',
        name: {
          fi: event.location.place.name ? event.location.place.name : '',
          sv: '',
          en: ''
        },
        '@id': `${environment.config.url.LEApiBaseUrl}place/${event.location.place.id}/`
      },
      location_extra_info: {
        fi: event.location.extraInfo ? event.location.extraInfo : '',
        sv: '',
        en: ''
      },

      // Price details
      offers: this.transformOffersToAPIFormat(event.offers),

      // Keywords
      keywords: this.transformKeywordsToAPIFormat(event.keywords),
      audience: this.transformKeywordsToAPIFormat(event.audiences),

      start_time: event.startTime ? event.startTime.toDate() : null,
      end_time: event.endTime ? event.endTime.toDate() : null,

      position: event.position ? event.position : null,
      images: event.images ? event.images : []
    };

    return eventInAPIFormat;
  }

  private transformEventsToApiFormat(events: Event[]) {

  }

  private transformEventsToUIFormat(events: any[]): Event[] {
    return events.map(event => {
      return this.transformEventToUIFormat(event);
    });
  }

  /**
   * Transforms data from API format to UI format and vice versa
   * @param value
   * @param transformType
   */
  transform(value: any, transformType: TransformType): any {
    if (transformType === TransformType.ToUI) {
      if (value instanceof Array) {
        return this.transformEventsToUIFormat(value);
      } else {
        return this.transformEventToUIFormat(value);
      }
    } else if (transformType === TransformType.ToAPI) {
      if (value instanceof Array) {
        return this.transformEventsToApiFormat(value);
      } else {
        return this.transformEventToApiFormat(value);
      }
    }
  }
}
