import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-studentLoginButton',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  display1;
  display2;
  display3;
  display4;
  form = new FormGroup({
  });

  constructor(private fb: FormBuilder, private httpClient: HttpClient) { }

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

  openModal4() {
    this.display4 = 'block';
  }

  onCloseHandled4() {
    this.display4 = 'none';
  }

  onYesHandled4() {
    this.httpClient.post('http://52.172.13.43:7085/api/CreateDemoParticipants')
      .subscribe(
        response => {
          console.log(response);
          alert("Succesfully Registered");
          window.location.reload();
        },
        err => {
          console.log("Error Ocurred" + err);
          alert("Already Registered");
          window.location.reload();
        }
      )
  }
}
