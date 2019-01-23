import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  angularForm = new FormGroup({
    inputEmail: new FormControl(),
    inputPassword: new FormControl(),
  });

  constructor(private fb: FormBuilder, public router: Router) {
    this.createForm();
  }

  createForm() {
    this.angularForm = this.fb.group({
      inputEmail: ['', Validators.required],
      inputPassword: ['', Validators.required],
    });
  }


  login(event) {
    const target = event.target;

    const inputEmail = target.querySelector('#inputEmail').value;
    const inputPassword = target.querySelector('#inputPassword').value;
    const selectRoles = target.querySelector('#selectRoles').value;

    console.log(inputEmail, inputPassword, selectRoles);

    if (selectRoles === 'Attorney') {
      this.router.navigateByUrl('/attorney');
    } else if (selectRoles === 'Registered Agent') {
      this.router.navigateByUrl('/registeredagent');
    } else {
      this.router.navigateByUrl('/defendant');
    }
  }
}
