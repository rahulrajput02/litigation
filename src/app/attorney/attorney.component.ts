import { Component, ElementRef, Input } from '@angular/core';
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

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private el: ElementRef) {
    this.createForm();
  }

  createForm() {
    this.angularForm = this.fb.group({
      defendantName: ['', Validators.required],
      plaintiffName: ['', Validators.required]
    });
  }

  ngOnInit() {
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

    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileToUpload');
    const fileCount: number = inputEl.files.length;
    const formData = new FormData();

    // const myobj = {
    //   "defendantName": defendantName, "plaintiffName": plaintiffName, "demandLetterType": demandLetterType
    // };

    //check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) {

      formData.append('file-to-upload', inputEl.files.item(0));
      console.log(formData);
      this.httpClient.post('http://localhost:3000/getletter', formData, { responseType: 'text' })
        .subscribe(
          response => {
            console.log(response);
            var pdfhash = response;
            var hashToBlock = {
              "$class": "org.hyperledger_composer.sop.DemandLetter",
              "plaintiff": plaintiffName,
              "defendant": defendantName,
              "caseType": demandLetterType,
              "registeredAgent": "CSC",
              "letterId": pdfhash,
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
                },
                err => {
                  alert("This pdf is already uploaded.");
                  console.log("Error Ocurred" + err);
                }
              )
          }
        )
    }
  }

  validate() {
    var validateObj = { "Transaction ID": this.validateBlock["transactionId"], "Timestamp": this.validateBlock["timestamp"] }
    console.log(validateObj);
  }
}
