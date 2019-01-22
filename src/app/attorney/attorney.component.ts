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
  debtorOption;
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

  createForm() {
    this.angularForm = this.fb.group({
      defendantName: ['', Validators.required],
      plaintiffName: ['', Validators.required]
    });
  }

  toggleButton() {
    this.secondFormVisible = true;
    this.firstFormVisible = false;

    //GET METHOD FOR DEBTOR TYPE

    this.httpClient.get(environment.getDebtorAPI)
      .subscribe(
        response => {
          console.log(response);
          this.debtorOption = response;
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )

    //GET METHOD FOR SECURED PARTY TYPE

    this.httpClient.get(environment.getSecuredPartyAPI)
      .subscribe(
        response => {
          console.log(response);
          this.securedPartyOption = response;
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )

  // refresh() {
  //   window.location.reload();
  // }

  ngOnInit() {

    this.httpClient.get(environment.getStatesAPI)
      .subscribe(
        response => {
          console.log(response);
          this.selectedState = response;
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )
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

    const myobj = {
      "defendantName": defendantName, "plaintiffName": plaintiffName, "demandLetterType": demandLetterType
    };

    console.log(myobj);

    // this.buttonClicked = true;
    //
    // this.httpClient.post(environment.postNewFilling, myobj, { responseType: 'text' })
    //   .subscribe(
    //     response => {
    //       console.log(response);
    //       var hashFromResp = response;
    //
    //       var hashToBlock = {
    //         "$class": "org.example.mynetwork.NewFilling",
    //         "hashId": response
    //       }
    //
    //       this.httpClient.post(environment.postToBlockChain, hashToBlock)
    //         .subscribe(
    //           response => {
    //             this.httpClient.get(environment.getNewFillingFromBlock + hashFromResp)
    //               .subscribe(
    //                 response => {
    //                   var submitTrans = {
    //                     "$class": "org.example.mynetwork.StoreHash",
    //                     "newFilling": "resource:org.example.mynetwork.NewFilling#" + response["hashId"],
    //                     "transactionId": "",
    //                     "timestamp": new Date()
    //                   }
    //
    //                   this.httpClient.post(environment.postHashToBlock, submitTrans)
    //                     .subscribe(
    //                       response => {
    //                         this.savedSuccess = true;
    //                         this.saveState = false;
    //                         this.validateBlock = response;
    //                         console.log(response["transactionId"]);
    //
    //                         const objTran = { "transactionId": response["transactionId"] };
    //
    //                         this.httpClient.post(environment.postTransactionId, objTran, { responseType: 'text' })
    //                           .subscribe(
    //                             response => {
    //                               console.log(response);
    //                               window.setInterval(reload, 2500);
    //
    //                               function reload() {
    //                                 window.location.reload();
    //                               }
    //                             }
    //                           );
    //                       });
    //                 });
    //           }
    //         );
      //   },
      //
      //   err => {
      //     console.log("Error Ocurred" + err);
      //   }
      // )
  }

  validate() {
    var validateObj = { "Transaction ID": this.validateBlock["transactionId"], "Timestamp": this.validateBlock["timestamp"] }
    console.log(validateObj);
  }
}
