import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'attorney-root',
  templateUrl: './attorney.component.html',
  styleUrls: ['./attorney.component.css']
})
export class AttorneyComponent {
  title = 'createFilling';
  secondFormVisible = false;
  firstFormVisible = true;
  letterId;
  securedPartyOption;
  juisdictions;
  selectedState;
  collateralOption;
  savedSuccess = false;
  saveState = true;
  validateBlock;
  buttonClicked = false;

  angularForm = new FormGroup({
    defendantName: new FormControl(),
    plaintiffName: new FormControl()
  });

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
    this.createForm();
  }

  fileChange(event): void {

  }

  createForm() {
    this.angularForm = this.fb.group({
      defendantName: ['', Validators.required],
      plaintiffName: ['', Validators.required]
    });
  }

  ngOnInit() {

    // this.httpClient.get(environment.getStatesAPI)
    //   .subscribe(
    //     response => {
    //       console.log(response);
    //       this.selectedState = response;
    //     },
    //     err => {
    //       console.log("Error Ocurred" + err);
    //     }
    //   )
  }

  typeChanged() {
    const selectedState = this.angularForm.get('selectedState').value;
    const data = { "state": selectedState };
    this.httpClient.post(environment.getJurisdictionAPI, data)
      .subscribe(
        response => {
          console.log(response);
          this.juisdictions = response;
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )
  }


  demandLetter(event) {
    const target = event.target;

    const defendantName = target.querySelector('#defendantName').value;
    const plaintiffName = target.querySelector('#plaintiffName').value;

    var demandLetterType;

    if (target.querySelector('#boc').checked) {
      demandLetterType = target.querySelector('#boc').value;
    } else {
      demandLetterType = target.querySelector('#lw').value;
    }

    const fileList: FileList = target.querySelector('#myFile').files;
    console.log(fileList.length);
    if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);

      // let headers = new Headers();
      // headers.append('Content-Type', 'multipart/form-data');
      // headers.append('Accept', 'application/json');
      // let options = new RequestOptions({ headers: headers });

    }

    const myobj = {
      "defendantName": defendantName, "plaintiffName": plaintiffName, "demandLetterType": demandLetterType
    };

    console.log(myobj);

    // this.httpClient.post(environment.postLetter, myobj, options)
    //   .subscribe(
    //     response => {
    //       console.log(response);
    //       this.letterId = response;

    var hashToBlock = {
      "$class": "org.hyperledger_composer.sop.DemandLetter",
      "plaintiff": plaintiffName,
      "defendant": defendantName,
      "caseType": demandLetterType,
      "registeredAgent": "CSC",
      "letterId": "3355",
      "demandLetterAcknowledgeStatus": "false",
      "forwardDemandLetterToDefendant": "false"
    }

    console.log(hashToBlock);

    this.httpClient.post('http://52.172.13.43:8085/api/DemandLetter', hashToBlock)
      .subscribe(
        response => {
          console.log(response);
          if (confirm('Your demand letter sent to Registered Agent.')) {
            window.location.reload();
          }
        }
      )
    //   }
    // )
  }

  validate() {
    var validateObj = { "Transaction ID": this.validateBlock["transactionId"], "Timestamp": this.validateBlock["timestamp"] }
    console.log(validateObj);
  }
}
