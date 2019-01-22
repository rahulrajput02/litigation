import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'createFilling-root',
  templateUrl: './createFilling.component.html',
  styleUrls: ['./createFilling.component.css']
})
export class createFillingComponent {
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
    newFillingRef: new FormControl(),
    orgNameD: new FormControl(),
    mailingAddressD: new FormControl(),
    cityNameD: new FormControl(),
    stateNameD: new FormControl(),
    postalCodeD: new FormControl(),
    orgNameS: new FormControl(),
    mailingAddressS: new FormControl(),
    cityNameS: new FormControl(),
    stateNameS: new FormControl(),
    postalCodeS: new FormControl(),
    attachmentDesc: new FormControl()
  });
  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
    this.createForm();
  }

  createForm() {
    this.angularForm = this.fb.group({
      newFillingRef: ['', Validators.required],
      orgNameD: ['', Validators.required],
      mailingAddressD: ['', Validators.required],
      cityNameD: ['', Validators.required],
      stateNameD: ['', Validators.required],
      postalCodeD: ['', Validators.required],
      orgNameS: ['', Validators.required],
      mailingAddressS: ['', Validators.required],
      cityNameS: ['', Validators.required],
      stateNameS: ['', Validators.required],
      postalCodeS: ['', Validators.required],
      attachmentDesc: ['', Validators.required],
      selectedState: []
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

    //GET METHOD FOR COLLATERAL TYPE

    this.httpClient.get(environment.getCollateralAPI)
      .subscribe(
        response => {
          console.log(response);
          this.collateralOption = response;
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )
  }

  refresh() {
    window.location.reload();
  }

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


  newFilling(event) {
    const target = event.target;

    const newFillingState = target.querySelector('#newFillingState').value;
    const newFillingJuidiction = target.querySelector('#newFillingJuidiction').value;
    var fillingFormType;

    if (target.querySelector('#UCC1').checked) {
      fillingFormType = target.querySelector('#UCC1').value;
    } else {
      fillingFormType = target.querySelector('#UCC3').value;
    }

    const newFillingRef = target.querySelector('#newFillingRef').value;
    const debtorType = target.querySelector('#debtorType').value;
    var debtorPartyType;

    if (target.querySelector('#business').checked) {
      debtorPartyType = target.querySelector('#business').value;
    } else {
      debtorPartyType = target.querySelector('#individual').value;
    }

    const debtorOrgName = target.querySelector('#debtorOrgName').value;
    const debtorMaillingAddress = target.querySelector('#debtorMaillingAddress').value;
    const debtorCity = target.querySelector('#debtorCity').value;
    const debtorState = target.querySelector('#debtorState').value;
    const debtorPostcode = target.querySelector('#debtorPostcode').value;
    const securedtype = target.querySelector('#securedtype').value;
    var securedPartyType;

    if (target.querySelector('#securedBusiness').checked) {
      securedPartyType = target.querySelector('#securedBusiness').value;
    } else {
      securedPartyType = target.querySelector('#securedindividual').value;
    }

    const securedOrgName = target.querySelector('#securedOrgName').value;
    const securedmaillingAddress = target.querySelector('#securedmaillingAddress').value;
    const securedCity = target.querySelector('#securedCity').value;
    const securedState = target.querySelector('#securedState').value;
    const securedPostcode = target.querySelector('#securedPostcode').value;
    const collateralType = target.querySelector('#collateralType').value;
    const attachmentType = target.querySelector('#attachmentType').value;
    var collateralIS;

    if (target.querySelector('#collateralIsNone').checked) {
      collateralIS = target.querySelector('#securedBusiness').value;
    } else if (target.querySelector('#collateralIsTrust').checked) {
      collateralIS = target.querySelector('#collateralIsTrust').value;
    } else {
      collateralIS = target.querySelector('#collateralIsRep').value;
    }

    const myobj = {
      "New_Filling_State": newFillingState, "New_Filling_Jurisdiction": newFillingJuidiction, "Filling_Form_Type": fillingFormType, "Billing_ref_1": newFillingRef, "Debtor_Type": debtorType, "Debtor_Party_type": debtorPartyType, "Debtor_Organisation_Name": debtorOrgName, "Debtor_Mailing_Address": debtorMaillingAddress, "Debtor_City": debtorCity, "Debtor_State": debtorState, "Debtor_Postal_Code": debtorPostcode,
      "Secured_Party_Type": securedtype, "Party_Type": securedPartyType, "Secured_Party_Organisation_Name": securedOrgName, "Secured_Party_Mailing_Address": securedmaillingAddress, "Secured_Party_City": securedCity, "Secured_Party_State": securedState, "Secured_Party_Postal_Code": securedPostcode,
      "Collateral_Type": collateralType, "Type_of_Attachment": attachmentType, "Collateral_Is": collateralIS
    };

    this.buttonClicked = true;

    this.httpClient.post(environment.postNewFilling, myobj, { responseType: 'text' })
      .subscribe(
        response => {
          console.log(response);
          var hashFromResp = response;

          var hashToBlock = {
            "$class": "org.example.mynetwork.NewFilling",
            "hashId": response
          }

          this.httpClient.post(environment.postToBlockChain, hashToBlock)
            .subscribe(
              response => {
                this.httpClient.get(environment.getNewFillingFromBlock + hashFromResp)
                  .subscribe(
                    response => {
                      var submitTrans = {
                        "$class": "org.example.mynetwork.StoreHash",
                        "newFilling": "resource:org.example.mynetwork.NewFilling#" + response["hashId"],
                        "transactionId": "",
                        "timestamp": new Date()
                      }

                      this.httpClient.post(environment.postHashToBlock, submitTrans)
                        .subscribe(
                          response => {
                            this.savedSuccess = true;
                            this.saveState = false;
                            this.validateBlock = response;
                            console.log(response["transactionId"]);

                            const objTran = { "transactionId": response["transactionId"] };

                            this.httpClient.post(environment.postTransactionId, objTran, { responseType: 'text' })
                              .subscribe(
                                response => {
                                  console.log(response);
                                  window.setInterval(reload, 2500);

                                  function reload() {
                                    window.location.reload();
                                  }
                                }
                              );
                          });
                    });
              }
            );
        },

        err => {
          console.log("Error Ocurred" + err);
        }
      )
  }

  validate() {
    var validateObj = { "Transaction ID": this.validateBlock["transactionId"], "Timestamp": this.validateBlock["timestamp"] }
    console.log(validateObj);
  }
}