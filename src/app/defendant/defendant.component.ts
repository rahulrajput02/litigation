import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'defendant-root',
  templateUrl: './defendant.component.html',
  styleUrls: ['./defendant.component.css']
})
export class DefendantComponent {
  transactionLink;
  fillingData;
  fileUrl;
  daysLeft = [];

  constructor(private httpClient: HttpClient, private routes: Router) { }


  ngOnInit() {
    this.httpClient.get('http://52.172.13.43:7085/api/queries/QDemandLetterByDefendant?defendant=resource%3Aorg.hyperledger_composer.sop.BusinessEntity%23vikram2%40abcd.com-B001')
      .subscribe(
        response => {
          console.log(response);
          this.fillingData = response;
          for (var i = 0; i < this.fillingData.length; i++) {
            var plaintiffSplit = ((this.fillingData[i].plaintiff).split('#'));
            this.plaintiffSplit = ((plaintiffSplit[1]));

            var defendantSplit = ((this.fillingData[i].defendant).split('#'));
            this.defendantSplit = ((defendantSplit[1]));

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

  acknowledge(index) {
    var obj = this.fillingData[index];
    var id = obj.letterId;

    var postObj = {
      "$class": "org.hyperledger_composer.sop.AcknowledgeReceivalByDefendant",
      "letter": "resource:org.hyperledger_composer.sop.DemandLetter#" + id,
      "demandLetterAcknowledgeStatus": "true"
    }

    console.log(postObj);

    this.httpClient.post('http://52.172.13.43:7085/api/AcknowledgeReceivalByDefendant ', postObj)
      .subscribe(
        response => {
          console.log(response);
          if (confirm('You have succesfully acknowledged demand letter from ' + obj.plaintiff + '.')) {
            window.location.reload();
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
