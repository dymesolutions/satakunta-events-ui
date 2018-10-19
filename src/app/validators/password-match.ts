import { AbstractControl } from '@angular/forms';

export class PasswordMatchValidation {

  static PasswordsMatch(abstractControl: AbstractControl) {
    const password = abstractControl.get('password').value;
    const passwordAgain = abstractControl.get('passwordAgain').value;

    if (password !== passwordAgain) {
      abstractControl.get('password').setErrors({ PasswordMatch: true });
    } else {
      return null;
    }
  }
}
