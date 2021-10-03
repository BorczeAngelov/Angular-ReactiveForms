import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {

  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.valid != null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  }
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }

  return { match: true };
}


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerFormModel: FormGroup;
  customer = new Customer(); //dataModel
  emailMessage: string;

  private validationMessages = { //This is a KeyValuePair
    required: 'Bitte enter your email address.',
    email: 'Bitte enter a valid email address.',
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.customerFormModel = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required]],
      }, { validator: emailMatcher }),
      phone: "",
      notification: 'email',
      rating: [null, ratingRange(1, 5)],
      sendCatalog: true
    });

    this.customerFormModel.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl= this.customerFormModel.get('emailGroup.email');
    emailControl.valueChanges.subscribe(
      value => this.setMessage(emailControl)
    );
  }

  save(): void {
    console.log(this.customerFormModel);
    console.log('Saved: ' + JSON.stringify(this.customerFormModel.value));
  }

  populateTestData(): void {
    this.customerFormModel.patchValue({
      firstName: "Borcze",
      lastName: ":)",
      sendCatalog: false
    });

    this.customerFormModel.get("emailGroup").patchValue({
      email: "test@test",
      confirmEmail: "test@test"
    });
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerFormModel.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    }
    else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

}
