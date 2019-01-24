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

  constructor(private httpClient: HttpClient, private routes: Router) { }


  ngOnInit() {
    this.httpClient.get('http://52.172.13.43:8085/api/DemandLetter?filter[where][forwardDemandLetterToDefendant]=true')
      .subscribe(
        response => {
          console.log(response);
          this.fillingData = response;
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

    this.httpClient.post('http://52.172.13.43:8085/api/AcknowledgeReceivalByDefendant ', postObj)
      .subscribe(
        response => {
          console.log(response);
          if (confirm('You have succesfully acknowledged demand letter from ' + obj.plaintiff + '.' )) {
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
