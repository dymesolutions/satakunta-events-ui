import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationUtil } from '@app/utils/form-validation-util';
import { TranslateService } from '@ngx-translate/core';
import { IImage } from '@app/interfaces/image';

export const httpPattern = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

@Component({
  selector: 'app-event-add-image-dialog',
  templateUrl: './event-add-image-dialog.component.html',
  styleUrls: ['./event-add-image-dialog.component.scss']
})
export class EventAddImageDialogComponent implements OnInit {
  eventImageGroup: FormGroup;
  imgSrc: string;
  linkRef: string;
  @ViewChild('imageFile') imageFile: ElementRef;

  private image: IImage;

  uploadedFile: any | null;
  validationMsgs: any;

  imageLinkIsValid: boolean;

  constructor(
    private dialogRef: MatDialogRef<EventAddImageDialogComponent>,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.eventImageGroup = new FormGroup({
      url: new FormControl(
        '',
        Validators.compose([
          Validators.pattern(httpPattern),
          Validators.maxLength(400)
        ])
      ),
      imageFile: new FormControl(''),
      photographer_name: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(255)])
      ),
      permissionConsent: new FormControl(false, Validators.requiredTrue)
    });

    if (data.image) {
      this.image = data.image;
    }

    if (data.image && !data.imageFile) {
      const imageUrl = data.image.url;
      this.loadImageUrl(imageUrl);
      this.eventImageGroup.get('url').setValue(imageUrl);
    }

    if (data.image && data.image.photographer_name) {
      this.eventImageGroup.get('photographer_name').setValue(data.image.photographer_name);
      this.eventImageGroup.get('permissionConsent').setValue(true);
    }

    if (data.imageFile) {
      this.uploadedFile = data.imageFile;
    }

    this.initValidationMessages();
    this.imageLinkIsValid = true;
  }

  ngOnInit() {
    if (this.uploadedFile) {
      this.loadImageFromFile();
    }

    // Image Link
    this.eventImageGroup.get('url').valueChanges.subscribe(value => {
      const imageUrl = this.eventImageGroup.get('url');
      if (imageUrl.value.length > 0) {
        this.imageLinkIsValid = true;
        if (imageUrl.valid) {
          this.imgSrc = value;
          this.uploadedFile = null;
        } else {
          console.log('Not valid');
        }
      } else {
        if (!this.uploadedFile) {
          this.imgSrc = null;
        }
      }
    });

    // Image Upload
    this.eventImageGroup.get('imageFile').valueChanges.subscribe(value => {
      this.uploadedFile = this.imageFile.nativeElement.files[0];
      this.loadImageFromFile();
    });
  }

  private initValidationMessages() {
    this.translateService
      .get(['validations.link', 'validations.name_required'])
      .subscribe(msg => {
        this.validationMsgs = {
          url: [
            {
              type: 'pattern',
              message: msg['validations.link']
            }
          ],
          photographer_name: [
            {
              type: 'required',
              message: msg['validations.name_required']
            }
          ]
        };
      });
  }

  private loadImageFromFile() {
    // Read the file for preview
    const reader = new FileReader();

    this.imageLinkIsValid = true;

    reader.onload = (elem: any) => {
      this.eventImageGroup.get('url').setValue('');
      this.imgSrc = elem.target.result;
    };

    reader.readAsDataURL(this.uploadedFile);
  }

  deleteLoadedImage() {
    this.imgSrc = '';
    this.uploadedFile = null;
  }

  private loadImageUrl(url: string) {
    this.imgSrc = url;
  }

  formReady() {
    FormValidationUtil.markFormGroupAsTouched(this.eventImageGroup);
    // Image uploaded or linked
    if (this.uploadedFile || this.eventImageGroup.get('url').value) {
      // Validate URL
      if (this.eventImageGroup.get('url').valid && this.eventImageGroup.get('photographer_name').valid) {
        // Check for consent
        if (this.eventImageGroup.get('permissionConsent').value) {
          this.dialogRef.close({
            linkRef: this.imgSrc,
            file: this.uploadedFile ? this.uploadedFile : null,
            photographer_name: this.eventImageGroup.get('photographer_name').value
          });
        } else {
          this.translateService
            .get(['gdpr.you_must_accept', 'shared.ok'])
            .subscribe(msg => {
              this.snackBar.open(
                msg['gdpr.you_must_accept'],
                msg['shared.ok'],
                {
                  duration: 3000
                }
              );
            });
        }
      }
    } else {
      // No image or image removed
      this.dialogRef.close({
        linkRef: null,
        file: null,
        photographer_name: null
      });
    }
  }

  close() {
    if (this.image) {
      // In case of editing:
      if (this.eventImageGroup.get('photographer_name').valid && this.eventImageGroup.get('permissionConsent').value) {
        this.dialogRef.close({
          id: this.image ? this.image.id : '',
          ['@id']: this.image ? this.image['@id'] : '',
          linkRef: this.imgSrc,
          file: this.uploadedFile ? this.uploadedFile : null,
          photographer_name: this.eventImageGroup.get('photographer_name').value
        });
      }
    } else {
      // Opened dialog but no changes:
      this.dialogRef.close({
        linkRef: null,
        file: null,
        photographer_name: null
      });
    }
  }

  onImageLoadingError() {
    this.imageLinkIsValid = false;
  }
}
