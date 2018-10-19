import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TransformType } from '@app/enums/transform-type';
import { IFetchEventApiFormat } from '@app/interfaces/fetch-event-api-format';
import { IImage } from '@app/interfaces/image';
import { ILangSelect } from '@app/interfaces/lang-select';
import { IPosition } from '@app/interfaces/position';
import { Event } from '@app/models/event';
import { Place } from '@app/models/place';
import { ApiDataPipe } from '@app/pipes/api-data.pipe';
import { ICheckedValue } from '@app/services/checked-value';
import { EventService } from '@app/services/event.service';
import { GmapService } from '@app/services/gmap.service';
import { ImageService } from '@app/services/image.service';
import { KeywordSetService } from '@app/services/keyword-set.service';
import { PlaceService } from '@app/services/place.service';
import { FormValidationUtil } from '@app/utils/form-validation-util';
import { EventAddImageDialogComponent } from '@app/views/events/event-add-image-dialog/event-add-image-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

// Validation patterns
export const emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
export const phonePattern = '^((\\+91-?)|0)?[0-9]{10}$';
export const timePattern = '^([0-9]|0[0-9]|1[0-9]|2[0-3]).[0-5][0-9]$';
export const httpPattern = '^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}$';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit, OnDestroy {

  // Form groups
  basicDetailsGroup: FormGroup;
  basicDetailsValidationMsgs: any;

  dateTimeGroup: FormGroup;
  dateTimeValidationMsgs: any;

  locationGroup: FormGroup;
  locationValidationMsgs: any;

  categoryGroup: FormGroup;
  categoryValidationMsgs: any;

  audienceGroup: FormGroup;
  audienceValidationMsgs: any;

  providerContactGroup: FormGroup;
  providerContactValidationMsgs: any;

  providerGroup: FormGroup;
  providerValidationMsgs: any;

  priceGroup: FormGroup;
  priceValidationMsgs: any;

  miscValidationMsgs: any;

  publishingConsent: FormControl;

  // Image:
  imgSrc: string;
  private image: IImage;
  private imageFile;
  private uploadingImage: boolean;

  // Toggles:
  inputLanguage: ILangSelect;
  showMap: boolean;
  showPriceFields: boolean;

  // Data repositories
  private formGroups: FormGroup[];
  allAreas: Place[];
  filteredAreas: Observable<Place[]>;

  // Subscriptions & Observers
  private geocodeResultSub: Subscription;
  private waitForGScriptSub: Subscription;
  private mapClickSubscription: Subscription;

  // Checked values
  categories: ICheckedValue[];
  audiences: ICheckedValue[];

  // Misc.
  private eventPosition: IPosition;
  editMode: boolean; // Use same form for editing
  loading: boolean; // Show loading spinner when fetching event details
  saving: boolean;

  // Used for internal checking (eventImageUrl used to check if submitting same image)
  private eventId: string;
  private eventImageUrl: string;
  private eventImageId: number;

  constructor(
    private apiDataPipe: ApiDataPipe,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private eventService: EventService,
    private imageService: ImageService,
    private gMapService: GmapService,
    private keywordSetService: KeywordSetService,
    private placeService: PlaceService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.inputLanguage = {
      fi: true,
      sv: false,
      en: false
    };

    this.showPriceFields = false;
    this.showMap = true;
    this.editMode = false;
    this.loading = false;
    this.uploadingImage = false;
    this.createFormGroups();
  }

  private createFormGroups() {
    this.formGroups = [];

    this.basicDetailsGroup = new FormGroup({
      nameFi: new FormControl('', Validators.required),
      nameSv: new FormControl(''),
      nameEn: new FormControl(''),
      shortDescriptionFi: new FormControl('', Validators.required),
      shortDescriptionSv: new FormControl(''),
      shortDescriptionEn: new FormControl(''),
      descriptionFi: new FormControl('', Validators.required),
      descriptionSv: new FormControl(''),
      descriptionEn: new FormControl('')
    });

    this.dateTimeGroup = new FormGroup({
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl(''),
      startTimeClock: new FormControl('', Validators.pattern(timePattern)),
      endTimeClock: new FormControl('', Validators.pattern(timePattern))
    });

    this.locationGroup = new FormGroup({
      area: new FormControl('', Validators.required),
      locationExtra: new FormControl('')
    });

    this.categoryGroup = new FormGroup({

    });

    this.audienceGroup = new FormGroup({

    });

    this.providerContactGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.compose([
        // Validators.pattern(phonePattern),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(emailPattern)
      ]))
    });

    this.providerGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl(''),
      email: new FormControl('', Validators.pattern(emailPattern)),
      link: new FormControl('')
    });

    this.priceGroup = new FormGroup({
      isFree: new FormControl(true),
      priceFi: new FormControl(''),
      priceSv: new FormControl(''),
      priceEn: new FormControl(''),
      descriptionFi: new FormControl(''),
      descriptionSv: new FormControl(''),
      descriptionEn: new FormControl(''),
      linkFi: new FormControl(''),
      linkSv: new FormControl(''),
      linkEn: new FormControl('')
    });

    // Push form groups to an array so we can iterate them more easily
    this.formGroups.push(this.basicDetailsGroup);
    this.formGroups.push(this.dateTimeGroup);
    this.formGroups.push(this.locationGroup);
    this.formGroups.push(this.categoryGroup);
    this.formGroups.push(this.audienceGroup);
    this.formGroups.push(this.providerContactGroup);
    this.formGroups.push(this.providerGroup);
    this.formGroups.push(this.priceGroup);

    this.publishingConsent = new FormControl(false);

    this.initValidationMessages();
  }

  ngOnInit() {
    this.getPlaces();
    this.subscribeToEvents();

    this.getKeywords().subscribe(done => {
      this.route.paramMap
        .subscribe(params => {
          const eventId = params.get('id');

          if (eventId) {
            // Event ID was passed as parameter, determine
            // that this is an edit action:
            this.editMode = true;
            this.getEvent(eventId);
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.geocodeResultSub) {
      this.geocodeResultSub.unsubscribe();
    }

    if (this.waitForGScriptSub) {
      this.waitForGScriptSub.unsubscribe();
    }

    if (this.mapClickSubscription) {
      this.mapClickSubscription.unsubscribe();
    }
  }

  /**
   * Gets the event with its ID and populates the form
   * @param id
   */
  private getEvent(id: string) {
    this.eventService.getByIdForEdit(id, [{
      include: 'keywords,location,audience'
    }])
      .subscribe(event => {
        this.eventId = event.id;
        this.populateForm(event);
      });
  }

  // TODO: Refactor to outer class?
  private populateForm(event: IFetchEventApiFormat) {
    // Populating the form when user navigates to edit route

    // Image
    if (event.images.length > 0) {
      this.imgSrc = event.images[0].url;
      this.eventImageUrl = event.images[0].url;
      this.image = {
        '@id': event.images[0]['@id'],
        id: event.images[0].id,
        name: 'image',
        url: event.images[0].url,
        photographer_name: '',
        license: 'cc_by'
      };
    }

    // Basic Details
    this.basicDetailsGroup.get('nameFi').setValue(event.name.fi);
    this.basicDetailsGroup.get('nameSv').setValue(event.name.sv);
    this.basicDetailsGroup.get('nameEn').setValue(event.name.en);
    this.basicDetailsGroup.get('shortDescriptionFi').setValue(event.short_description.fi);
    this.basicDetailsGroup.get('shortDescriptionSv').setValue(event.short_description.sv);
    this.basicDetailsGroup.get('shortDescriptionEn').setValue(event.short_description.en);
    this.basicDetailsGroup.get('descriptionFi').setValue(event.description.fi);
    this.basicDetailsGroup.get('descriptionSv').setValue(event.description.sv);
    this.basicDetailsGroup.get('descriptionEn').setValue(event.description.en);

    // Date time
    this.dateTimeGroup.get('startTime').setValue(event.start_time);
    this.dateTimeGroup.get('endTime').setValue(event.end_time);
    this.dateTimeGroup.get('startTimeClock').setValue(this.datePipe.transform(event.start_time, 'HH.mm'));
    this.dateTimeGroup.get('endTimeClock').setValue(this.datePipe.transform(event.end_time, 'HH.mm'));

    this.providerContactGroup.get('name').setValue(event.provider_contact_name);
    this.providerContactGroup.get('phone').setValue(event.provider_contact_phone);
    this.providerContactGroup.get('email').setValue(event.provider_contact_email);
    this.providerGroup.get('name').setValue(event.provider_name);
    this.providerGroup.get('phone').setValue(event.provider_phone);
    this.providerGroup.get('email').setValue(event.provider_email);
    this.providerGroup.get('link').setValue(event.provider_link);

    // Location
    this.locationGroup.get('area').setValue({
      id: event.location.id,
      name: event.location.name.fi
    });
    this.locationGroup.get('locationExtra').setValue(event.location_extra_info.fi);
    this.eventPosition = event.position;

    this.categories.forEach(category => {
      event.keywords.forEach(keyword => {
        if (keyword.id === category.id) {
          category.isChecked = true;
        }
      });
    });


    this.audiences.forEach(audience => {
      event.audience.forEach(eventAudience => {
        if (audience.id === eventAudience.id) {
          audience.isChecked = true;
        }
      });
    });

    const offer = event.offers[0];

    this.priceGroup.get('isFree').setValue(offer.is_free);

    if (!event.offers[0].isFree) {
      this.priceGroup.get('priceFi').setValue(offer.price.fi ? offer.price.fi : '');
      this.priceGroup.get('priceSv').setValue(offer.price.sv ? offer.price.sv : '');
      this.priceGroup.get('priceEn').setValue(offer.price.en ? offer.price.en : '');

      this.priceGroup.get('descriptionFi').setValue(offer.description.fi ? offer.description.fi : '');
      this.priceGroup.get('descriptionSv').setValue(offer.description.sv ? offer.description.sv : '');
      this.priceGroup.get('descriptionEn').setValue(offer.description.en ? offer.description.en : '');

      this.priceGroup.get('linkFi').setValue(offer.info_url.fi ? offer.info_url.fi : '');
      this.priceGroup.get('linkSv').setValue(offer.info_url.sv ? offer.info_url.sv : '');
      this.priceGroup.get('linkEn').setValue(offer.info_url.en ? offer.info_url.en : '');
    }
  }

  private initValidationMessages() {
    this.translateService.get([
      'validations.field_is_required',
      'validations.enter_valid_email',
      'validations.maximum_length_exceeded',
      'validations.time_format'
    ]).subscribe(msg => {
      this.basicDetailsValidationMsgs = {
        nameFi: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        shortDescriptionFi: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        descriptionFi: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }]
      };

      this.dateTimeValidationMsgs = {
        startTime: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        startTimeClock: [{
          type: 'pattern',
          message: msg['validations.time_format']
        }],
        endTimeClock: [{
          type: 'pattern',
          message: msg['validations.time_format']
        }]
      };

      this.categoryValidationMsgs = {

      };

      this.audienceValidationMsgs = {

      };

      this.providerContactValidationMsgs = {
        name: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        phone: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        email: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }, {
          type: 'pattern',
          message: msg['validations.enter_valid_email']
        }]
      };

      this.locationValidationMsgs = {
        area: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }]
      };

      this.providerValidationMsgs = {
        name: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        phone: [{

        }],
        email: [{
          type: 'pattern',
          message: msg['validations.enter_valid_email']
        }],
        link: [{

        }],
      };
    });
  }

  private subscribeToEvents() {
    if (!this.gMapService.isGScriptLoaded) {
      this.waitForGScriptSub = this.gMapService.waitForGScript
        .subscribe(isLoaded => {
          if (isLoaded) {
            this.geocodeResultSub = this.gMapService.geocodeResult
              .subscribe(result => {
                // Store location
                this.eventPosition = {
                  lat: result.geometry.location.lat(),
                  lng: result.geometry.location.lng()
                };
              });

            this.mapClickSubscription = this.gMapService.mapClick
              .subscribe(result => {
                this.eventPosition = result;
              });
          }
        });
    } else {
      this.geocodeResultSub = this.gMapService.geocodeResult
        .subscribe(result => {
          // Store location
          this.eventPosition = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          };
        });

      this.mapClickSubscription = this.gMapService.mapClick
        .subscribe(result => {
          this.eventPosition = result;
        });
    }

    this.priceGroup.get('isFree').valueChanges
      .subscribe(value => this.showPriceFields = !value);

    this.locationGroup.get('locationExtra').valueChanges
      .pipe(distinctUntilChanged())
      .pipe(debounceTime(1000))
      .subscribe(address => {
        this.gMapService.geocode(address);
      });
  }

  private filterArea(name: string): any[] {
    return this.allAreas.filter(area => area.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  private setAutocompleteField() {
    // When typing in the area field, filter the options
    this.filteredAreas = this.locationGroup.get('area').valueChanges
      .pipe(
        startWith(<string | Place>''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterArea(name) : this.allAreas.slice())
      );

    this.locationGroup.get('area').valueChanges
      .subscribe(area => {
        this.gMapService.geocode(area.name);
      });
  }

  private getKeywords(): Observable<boolean> {
    const sub = new Subject<boolean>();

    this.keywordSetService.getAll([
      { include: 'keywords' }
    ]).subscribe(keywordSets => {
      keywordSets.data.forEach(keywordSet => {
        if (keywordSet.id === 'pori:topics') {
          // Find main categories from the keyword sets
          this.categories = keywordSet.keywords.map(keyword => {
            return {
              id: keyword.id,
              name: keyword.name.fi,
              isChecked: false
            };
          }).sort((a, b) => {
            // Sort by name
            return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
          });
        } else if (keywordSet.id === 'pori:audiences') {
          // Find audiences from keyword sets
          this.audiences = keywordSet.keywords.map(keyword => {
            return {
              id: keyword.id,
              name: keyword.name.fi,
              isChecked: false
            };
          }).sort((a, b) => {
            // Sort by name
            return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
          });
        }

        sub.next(true);
      });
    });

    return sub.asObservable();
  }

  private getPlaces() {
    this.placeService.getAll([
      { sort: 'name' },
      { show_all_places: 1 },
      { page_size: 100 }
    ])
      .subscribe(places => {
        this.allAreas = places.data.map(place => {
          return {
            name: place.name.fi,
            id: place.id
          };
        });

        this.setAutocompleteField();
      });
  }


  /**
   * For autocomplete
   * @param area
   */
  displayFn(area?: Place): string | undefined {
    return area ? area.name : undefined;
  }

  private addOffers(event: Event) {
    const isFree = this.priceGroup.get('isFree').value;

    if (isFree) {
      event.offers = [{
        isFree: true
      }];
    } else {
      event.offers = [{
        isFree: false,
        price: {
          fi: this.priceGroup.get('priceFi').value,
          sv: this.priceGroup.get('priceSv').value,
          en: this.priceGroup.get('priceEn').value,
        },
        info_url: {
          fi: this.priceGroup.get('linkFi').value,
          sv: this.priceGroup.get('linkSv').value,
          en: this.priceGroup.get('linkEn').value,
        },
        description: {
          fi: '',
          sv: '',
          en: ''
        }
      }];
    }
  }

  private addKeywords(event: Event) {
    event.keywords = this.categories
      .filter(category => {
        return category.isChecked;
      })
      .map(category => {
        return {
          id: category.id,
          name: category.name
        };
      });
  }

  private addAudiences(event: Event) {
    event.audiences = this.audiences
      .filter(audience => {
        return audience.isChecked;
      })
      .map(audience => {
        return {
          id: audience.id,
          name: audience.name
        };
      });
  }

  private resolveTimeFromClockValue(clock: string) {

    const timeComponents = () => {
      if (clock.includes('.')) {
        return clock.split('.');
      } else if (clock.includes(':')) {
        return clock.split(':');
      }
    };

    return {
      hour: +timeComponents()[0],
      minute: +timeComponents()[1]
    };
  }

  private createEventModel(imageRef: any): Event {
    const newEvent = new Event();
    console.log('Creating event model');

    newEvent.name = {
      fi: this.basicDetailsGroup.get('nameFi').value,
      sv: this.basicDetailsGroup.get('nameSv').value,
      en: this.basicDetailsGroup.get('nameEn').value
    };

    newEvent.shortDescription = {
      fi: this.basicDetailsGroup.get('shortDescriptionFi').value,
      sv: this.basicDetailsGroup.get('shortDescriptionSv').value,
      en: this.basicDetailsGroup.get('shortDescriptionEn').value
    };

    newEvent.description = {
      fi: this.basicDetailsGroup.get('descriptionFi').value,
      sv: this.basicDetailsGroup.get('descriptionSv').value,
      en: this.basicDetailsGroup.get('descriptionEn').value
    };

    newEvent.startTime = this.dateTimeGroup.get('startTime').value;
    newEvent.endTime = this.dateTimeGroup.get('endTime').value;

    if (typeof newEvent.startTime === 'string') {
      newEvent.startTime = moment(this.dateTimeGroup.get('startTime').value);
    }

    if (typeof newEvent.endTime === 'string') {
      newEvent.endTime = moment(this.dateTimeGroup.get('endTime').value);
    }

    // Time (clock)
    const startTimeClock = this.dateTimeGroup.get('startTimeClock').value;

    if (startTimeClock) {
      const timeComponents = this.resolveTimeFromClockValue(startTimeClock);
      newEvent.startTime.hour(timeComponents.hour);
      newEvent.startTime.minute(timeComponents.minute);
    }

    const endTimeClock = this.dateTimeGroup.get('endTimeClock').value;

    if (endTimeClock) {
      const timeComponents = this.resolveTimeFromClockValue(endTimeClock);
      newEvent.endTime.hour(timeComponents.hour);
      newEvent.endTime.minute(timeComponents.minute);
    }

    newEvent.location = {
      place: this.locationGroup.get('area').value,
      extraInfo: this.locationGroup.get('locationExtra').value,
      position: null
    };

    newEvent.provider = {
      name: this.providerGroup.get('name').value,
      phone: this.providerGroup.get('phone').value,
      email: this.providerGroup.get('email').value,
      link: this.providerGroup.get('link').value,
      contactName: this.providerContactGroup.get('name').value,
      contactPhone: this.providerContactGroup.get('phone').value,
      contactEmail: this.providerContactGroup.get('email').value
    };

    this.addOffers(newEvent);
    this.addKeywords(newEvent);
    this.addAudiences(newEvent);

    newEvent.position = this.eventPosition;

    if (imageRef) {
      newEvent.images.push({
        '@id': imageRef['@id']
      });
    }

    return newEvent;
  }

  openAddImageDialog() {
    const dialogRef = this.dialog.open(EventAddImageDialogComponent, {
      width: '80%',
      data: {
        image: this.image,
        imageFile: this.imageFile
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        this.imageFile = result.file;

        if (result.linkRef) {
          this.imgSrc = result.linkRef;
        } else {
          this.imgSrc = null;
        }

        if (!result.file && result.linkRef) {
          this.image = {
            '@id': '',
            id: null,
            name: 'image',
            url: result.linkRef,
            photographer_name: '',
            license: 'cc_by'
          };
        } else {
          this.image = null;
        }
      });
  }

  private saveEvent(imageRef: any) {
    this.eventService.save(
      this.apiDataPipe.transform(this.createEventModel(imageRef), TransformType.ToAPI)
    ).subscribe(result => {
      // Everything OK -> show the event details page
      this.router.navigate(['/event', 'created']);
    }, errors => {
      // Something is wrong, show message
      this.translateService.get([
        'shared.ok'
      ]).subscribe(msg => {
        this.snackBar.open('Virhe', msg['shared.ok']);
        this.saving = false;
      });
    });
  }

  private updateEvent(imageRef: any) {
    this.eventService.saveEdit(
      this.apiDataPipe.transform(this.createEventModel(imageRef), TransformType.ToAPI), this.eventId
    ).subscribe(result => {
      // Everything OK -> show the event details page
      this.router.navigate(['/manage', 'event', 'list']);
    }, errors => {
      // Something is wrong, show message
      this.translateService.get([
        'shared.ok'
      ]).subscribe(msg => {
        this.snackBar.open('Virhe', msg['shared.ok']);
        this.saving = false;
      });
    });
  }

  private uploadImage(): Observable<IImage> {
    const uploadSubject = new Subject<IImage>();
    this.imageService.upload(this.imageFile)
      .subscribe(result => {
        const image = {
          '@id': '',
          id: null,
          name: 'image',
          url: result.image_url,
          photographer_name: '',
          license: 'cc_by'
        };

        uploadSubject.next(image);
      }, errors => {
        uploadSubject.error(errors);
      });

    return uploadSubject.asObservable();
  }

  private saveImageReference(): Observable<any> {
    const imageSubject = new Subject<any>();
    this.imageService.save(this.image)
      .subscribe(result => {
        // this.saveEvent(result);
        imageSubject.next(result);
      }, errors => {
        imageSubject.error(errors);
      });

    return imageSubject.asObservable();
  }

  save() {

  }

  publish() {
    if (this.publishingConsent.value) {
      // Check that all form groups are valid before adding the data to the model
      let valid = true;
      this.formGroups.forEach(formGroup => {
        if (formGroup.invalid) {
          valid = false;
        }
      });

      if (valid) {
        this.saving = true;

        if (!this.editMode) {
          // *** Save new event mode ***

          // First check if need to upload image
          if (this.imageFile) {
            this.uploadingImage = true;
            const uploadSub = this.uploadImage()
              .subscribe(image => {
                this.uploadingImage = false;
                this.image = image;

                // Then save the uploaded image as a reference
                this.saveImageReference()
                  .subscribe(result => {
                    // Finally save the event
                    this.saveEvent(result);
                  }, errors => {
                    this.translateService.get([
                      'errors.image_cant_be_saved',
                      'shared.ok'
                    ]).subscribe(msg => {
                      this.snackBar.open(msg['errors.image_cant_be_saved'], msg['ok'], {
                        duration: 3000
                      });

                      this.saving = false;
                    });
                  });
              }, errors => {
                this.uploadingImage = false;
                this.translateService.get([
                  'errors.image_cant_be_saved',
                  'shared.ok'
                ]).subscribe(msg => {
                  this.snackBar.open(msg['errors.image_cant_be_saved'], msg['ok'], {
                    duration: 3000
                  });

                  this.saving = false;
                });
              });
          } else if (this.image) {
            // Save image reference if it exists
            this.imageService.save(this.image)
              .subscribe(result => {
                this.saveEvent(result);
              }, errors => {
                this.translateService.get([
                  'errors.image_cant_be_saved',
                  'shared.ok'
                ]).subscribe(msg => {
                  this.snackBar.open(msg['errors.image_cant_be_saved'], msg['ok'], {
                    duration: 3000
                  });

                  this.saving = false;
                });
              });
          } else {
            this.saveEvent(null);
          }
        } else {
          // *** Edit Mode ***
          // First check if need to upload image
          if (this.imageFile) {
            this.uploadingImage = true;
            const uploadSub = this.uploadImage()
              .subscribe(image => {
                this.uploadingImage = false;
                this.image = image;

                // Then save the uploaded image as a reference
                this.saveImageReference()
                  .subscribe(result => {
                    // Finally save the event
                    this.updateEvent(result);
                  }, errors => {
                    this.translateService.get([
                      'errors.image_cant_be_saved',
                      'shared.ok'
                    ]).subscribe(msg => {
                      this.snackBar.open(msg['errors.image_cant_be_saved'], msg['ok'], {
                        duration: 3000
                      });

                      this.saving = false;
                    });
                  });
              }, errors => {
                this.uploadingImage = false;
                this.translateService.get([
                  'errors.image_cant_be_saved',
                  'shared.ok'
                ]).subscribe(msg => {
                  this.snackBar.open(msg['errors.image_cant_be_saved'], msg['ok'], {
                    duration: 3000
                  });

                  this.saving = false;
                });
              });
          } else if (this.image) {
            // Save image first if it exists and is not same as before
            if (this.image.url !== this.eventImageUrl) {
              this.imageService.save(this.image)
                .subscribe(result => {
                  this.updateEvent(result);
                }, errors => {
                  this.translateService.get([
                    'errors.image_cant_be_saved',
                    'shared.ok'
                  ]).subscribe(msg => {
                    this.snackBar.open(msg['errors.image_cant_be_saved'], msg['ok'], {
                      duration: 3000
                    });

                    this.saving = false;
                  });
                });
            } else {
              this.updateEvent(this.image);
            }
          } else {
            this.updateEvent(null);
          }
        }
      } else {
        this.formGroups.forEach(formGroup => {
          FormValidationUtil.markFormGroupAsTouched(formGroup);
        });

        this.translateService.get([
          'validations.form_has_errors',
          'shared.ok'
        ]).subscribe(msg => {
          this.snackBar.open(msg['validations.form_has_errors'], msg['shared.ok'], {
            duration: 10000
          });
        });
      }
    } else {
      // Show GDPR consent message if user hasn't checked the field
      this.translateService.get([
        'gdpr.you_must_accept',
        'shared.ok'
      ]).subscribe(msg => {
        this.snackBar.open(msg['gdpr.you_must_accept'], msg['shared.ok'], { duration: 10000 });
      });
    }
  }
}
