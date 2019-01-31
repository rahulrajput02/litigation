import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-studentLoginButton',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  display1;
  display2;
  display3;
  form = new FormGroup({
  });

  constructor(private fb: FormBuilder) { }

  openModal() {
    this.display1 = 'block';
  }

  onCloseHandled() {
    this.display1 = 'none';
  }

  openModal2() {
    this.display2 = 'block';
  }

  onCloseHandled2() {
    this.display2 = 'none';
  }

  openModal3() {
    this.display3 = 'block';
  }

  onCloseHandled3() {
    this.display3 = 'none';
  }
}
