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


  constructor(private httpClient: HttpClient, private routes: Router) { }


  ngOnInit() {
    this.validate = false;
    this.httpClient.get('http://52.172.13.43:8085/api/DemandLetter?filter[where][forwardDemandLetterToDefendant]=false')
      .subscribe(
        response => {
          console.log(response);
          this.fillingData = response;
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

  pdfDownload(letterId) {
    // this.httpClient.get('api/' + letterId)
    //   .subscribe(
    //     response => {
    //       console.log(response);
    //     }
    //   )
    const data = { "Pdf_Path": "dfd" };
    this.httpClient.post(environment.postPdf, data, { responseType: 'text' })
      .subscribe(response => {
        console.log(response);

        this.httpClient.get(environment.getPdf, { responseType: 'arraybuffer' })
          .subscribe(response => {
            console.log(response);
            var blob = new Blob([response], { type: 'application/pdf' });
            this.fileUrl = window.URL.createObjectURL(blob);

            //Open PDF in new tab
            window.open(this.fileUrl);

            //***** Download PDF *****//
            //var link = document.createElement('a');
            //document.body.appendChild(link);
            //link.setAttribute('style', 'display: none');
            //link.href = this.fileUrl;
            //link.download = "fillingDocs.pdf";
            //link.click();
            //window.URL.revokeObjectURL(this.fileUrl);
            //link.remove();
          })
      });
  }
}
