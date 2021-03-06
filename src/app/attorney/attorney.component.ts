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
  registeredAgentName;
  defendantName = [];
  firstFormVisible = true;
  letterId;
  submitClicked = false;
  currentTime;
  fileUrl;
  plaintiffName;
  responseOwner;
  fillingData;
  daysLeft = [];


  angularForm = new FormGroup({
    registeredAgentName: new FormControl(),
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
      registeredAgentName: ['', Validators.required],
      defendantName: ['', Validators.required],
      plaintiffName: ['', Validators.required],
      natureOfCase: ['', Validators.required],
      documentType: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.httpClient.get('http://52.172.13.43:7085/api/RegisteredAgent')
      .subscribe(
        response => {
          console.log(response);
          this.registeredAgentName = response;
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )

      this.httpClient.get('http://52.172.13.43:7085/api/Person')
        .subscribe(
          response => {
            console.log(response);
            this.plaintiffName = response;
          },
          err => {
            console.log("Error Ocurred" + err);
          }
        )
  }

  typeChanged() {
    const selectedRA = this.angularForm.get('registeredAgentName').value;
    console.log(selectedRA);
    this.httpClient.get('http://52.172.13.43:7085/api/queries/QBusinessEntityByRegisteredAgent?registeredAgentID=resource%3Aorg.hyperledger_composer.sop.RegisteredAgent%23' + selectedRA)
      .subscribe(
        response => {
          // console.log(response.length);
          this.defendantName = [];
          this.responseOwner = response;
          for (var i = 0; i < this.responseOwner.length; i++) {
            var arrayData = ((this.responseOwner[i].owner).split('#'));
            console.log(arrayData);
            this.defendantName.push((arrayData[1] + '-' + this.responseOwner[i].businessID));
          }

          // this.defendantName = response;
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )
  }

  demandLetter(event) {
    const target = event.target;

    const registeredAgentName = target.querySelector('#registeredAgentName').value;
    const defendantName = target.querySelector('#defendantName').value;
    const plaintiffName = target.querySelector('#plaintiffName').value;

    const natureOfCase = target.querySelector('#natureOfCase').value;
    const documentType = target.querySelector('#documentType').value;

    console.log(defendantName, registeredAgentName, plaintiffName);

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
      this.httpClient.post(environment.getLetter, formData, { responseType: 'text' })
        .subscribe(
          response => {
            console.log(response);
            var pdfhash = response;
            var hashToBlock = {
              "$class": "org.hyperledger_composer.sop.DemandLetter",
              "plaintiff": plaintiffName,
              "defendant": "resource:org.hyperledger_composer.sop.BusinessEntity#" + defendantName,
              "documentType": documentType,
              "natureOfCase": natureOfCase,
              "letterId": pdfhash,
              "registeredAgent": "resource:org.hyperledger_composer.sop.RegisteredAgent#" + registeredAgentName,
              "demandLetterAcknowledgeStatus": "false",
              "forwardDemandLetterToDefendant": "false",
              "initiationTimestamp": Math.round(((new Date().getTime()) / 1000))
            }

            console.log(hashToBlock);

            this.httpClient.post('http://52.172.13.43:7085/api/DemandLetter', hashToBlock)
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
    return this.httpClient.get('http://52.172.13.43:7085/api/DemandLetter?filter[where][forwardDemandLetterToDefendant]=false')
      .subscribe(
        response => {
          console.log(response);
          this.submitClicked = true;
          this.fillingData = response;

          for (var i = 0; i < this.fillingData.length; i++) {
            var plaintiffSplit = ((this.fillingData[i].plaintiff).split('#'));
            this.plaintiffSplit = ((plaintiffSplit[1]));

            var defendantSplit = ((this.fillingData[i].defendant).split('#'));
            this.defendantSplit = ((defendantSplit[1]));

            console.log(this.plaintiffSplit, this.defendantSplit);

            this.daysLeft[i] = daysLeft(this.fillingData[i].initiationTimestamp);
            var sortedDate = convert(this.fillingData[i].initiationTimestamp);
            this.fillingData[i].initiationTimestamp = sortedDate;
            this.fillingData[i].defendant = this.defendantSplit;
            this.fillingData[i].plaintiff = this.plaintiffSplit;
          }
        },
        err => {
          console.log("Error Ocurred" + err);
        }
      )
  }

  pdfDownload(id) {
    this.httpClient.get(environment.getFile + id, { responseType: 'arraybuffer' })
      .subscribe(response => {
        console.log(response);
        var blob = new Blob([response], { type: 'application/pdf' });
        this.fileUrl = window.URL.createObjectURL(blob);

        //Open PDF in new tab
        window.open(this.fileUrl);

      })
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

function daysLeft(timestamp2) {
  var difference = ((new Date().getTime()) / 1000) - timestamp2;
  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);

  return daysDifference;
}
