import { FormGroup } from '@angular/forms';

export class FormValidationUtil {

  static markFormGroupAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(k => {
      const control = formGroup.get(k);
      control.markAsTouched();
    });
  }
}
