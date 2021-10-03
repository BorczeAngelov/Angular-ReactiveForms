import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
      firstName: '',
      lastName: '',
      email: '',
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
}
