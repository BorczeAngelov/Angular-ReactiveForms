import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerFormModel: FormGroup;
  customer = new Customer(); //dataModel

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerFormModel = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: "",
      notification: 'email',
      sendCatalog: true
    });
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
