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
  acknowledged;
  validate;
  studentData;
  fillingData;
  transactionData;
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

  acknowledge(index) {
    alert('You have succesfully acknowledged your demand letter');

  }

  pdfDownload(pdfPath) {
    console.log(pdfPath);
    const data = { "Pdf_Path": pdfPath };
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
