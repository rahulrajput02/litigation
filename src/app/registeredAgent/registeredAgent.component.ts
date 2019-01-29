import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'registeredAgent-root',
  templateUrl: './registeredAgent.component.html',
  styleUrls: ['./registeredAgent.component.css']
})
export class RegisteredAgentComponent {
  transactionLink;
  validate;
  studentData;
  fillingData;
  transactionData;
  fileUrl;
  daysLeft = [];


  constructor(private httpClient: HttpClient, private routes: Router) { }


  ngOnInit() {
    this.validate = false;
    this.httpClient.get('http://52.172.13.43:8085/api/DemandLetter?filter[where][forwardDemandLetterToDefendant]=false')
      .subscribe(
        response => {
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

    // this.fillingData = [{
    //   "id": '1',"defendantName": 'Rahul Rajput', "plaintiffName": 'Vikram Singh', "letterType": 'Breach of Contract'
    // }];
  }

  // validateButton(letterId) {
  //   this.httpClient.get(environment.getTransactionDetails + transactionId)
  //     .subscribe(
  //       response => {
  //         this.transactionData = JSON.stringify(response, null, "\t");
  //         alert(this.transactionData);
  //         console.log(this.transactionData);
  //       }
  //     )
  // }

  forwardButton(index) {
    var obj = this.fillingData[index];
    var id = obj.letterId;

    var postObj = {
      "$class": "org.hyperledger_composer.sop.SendDemandLetterToDefendant",
      "letter": "resource:org.hyperledger_composer.sop.DemandLetter#" + id,
      "forwardDemandLetterToDefendant": "true"
    }

    console.log(postObj);

    this.httpClient.post('http://52.172.13.43:8085/api/SendDemandLetterToDefendant', postObj)
      .subscribe(
        response => {
          console.log(response);
          if (confirm('Demand Letter has succesfully sent to Defendant.')) {
            window.location.reload();
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

function daysLeft(timestamp2)  {
      var  difference  = ((new Date().getTime()) / 1000) -  timestamp2;
      var  daysDifference  =  Math.floor(difference / 1000 / 60 / 60 / 24);

      return  daysDifference;
}
