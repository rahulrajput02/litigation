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
  submitClicked = false;
  currentTime;
  daysLeft = [];


  angularForm = new FormGroup({
    defendantName: new FormControl(),
    plaintiffName: new FormControl(),
    natureOfCase: new FormControl(),
    documentType: new FormControl(),
  });

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private el: ElementRef) {
    this.createForm();
  }

  createForm() {
    this.angularForm = this.fb.group({
      defendantName: ['', Validators.required],
      plaintiffName: ['', Validators.required],
      natureOfCase: ['', Validators.required],
      documentType: ['', Validators.required],
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

    const natureOfCase = target.querySelector('#natureOfCase').value;
    const documentType = target.querySelector('#documentType').value;

    console.log(natureOfCase, documentType);

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
              "documentType": documentType,
              "natureOfCase": natureOfCase
              "registeredAgent": "CSC",
              "letterId": pdfhash,
              "demandLetterAcknowledgeStatus": "false",
              "forwardDemandLetterToDefendant": "false",
              "initiationTimestamp": Math.round(((new Date().getTime())/1000));
            }

            console.log(hashToBlock);

            this.httpClient.post('http://52.172.13.43:8085/api/DemandLetter', hashToBlock)
              .subscribe(
                response => {
                  console.log(response);
                  if (confirm('Your demand letter sent to Registered Agent.')) {
                    this.showTable();
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

  showTable() {
    return this.httpClient.get('http://52.172.13.43:8085/api/DemandLetter?filter[where][forwardDemandLetterToDefendant]=false')
      .subscribe(
        response => {
          console.log(response);
          this.submitClicked = true;

          this.fillingData = response;
          for (var i = 0; i < this.fillingData.length; i++) {
            this.daysLeft[i] = daysLeft(this.fillingData[i].initiationTimestamp);
            var sortedDate = convert(this.fillingData[i].initiationTimestamp);
            this.fillingData[i].initiationTimestamp = sortedDate;
          }
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )
  }

  pdfDownload(id) {
    this.httpClient.get('http://localhost:3000/getfile/' + id, { responseType: 'arraybuffer' })
      .subscribe(response => {
        console.log(response);
        var blob = new Blob([response], { type: 'application/pdf' });
        this.fileUrl = window.URL.createObjectURL(blob);

        //Open PDF in new tab
        window.open(this.fileUrl);

      })
  }

  validate() {
    var validateObj = { "Transaction ID": this.validateBlock["transactionId"], "Timestamp": this.validateBlock["timestamp"] }
    console.log(validateObj);
  }

}

function convert(time) {
  // Unixtimestamp
  var unixtimestamp = time;
  // Months array
  var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp * 1000);
  // Year
  var year = date.getFullYear();
  // Month
  var month = months_arr[date.getMonth()];
  // Day
  var day = date.getDate();
  // Hours
  var hours = date.getHours();
  // Minutes
  var minutes = "0" + date.getMinutes();
  // Seconds
  var seconds = "0" + date.getSeconds();
  // Display date time in MM-dd-yyyy h:m:s format
  var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return convdataTime;
}

function daysLeft(timestamp2) {
    var difference = ((new Date().getTime())/1000) - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);

    return daysDifference;
}
