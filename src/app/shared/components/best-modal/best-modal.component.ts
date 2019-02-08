import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {LoaderService} from '../../services/loader-service.service';

@Component({
    selector: 'camel-best-modal',
    templateUrl: './best-modal.component.html',
    styleUrls: ['./best-modal.component.scss']
})
export class BestModalComponent implements OnInit {
    /**
     * VARIABLEN
     */
    public kundenNummer: string;
    public email: string;
    requestSuccesully: boolean = false;
    requestError: boolean = false;

    constructor(public activeModal: NgbActiveModal, private csvService: CsvExportService, public $httpLoader: LoaderService) {
    }

    ngOnInit() {
        this.kundenNummer = sessionStorage.getItem('kundenNummer');
        this.requestError = false;
        this.requestSuccesully = false;
    }


    /**
     * Sends data to backend and waits for response and handle it
     * @param value - data from the form
     */
    protected sendData(value){
      if(this.email) {
        value.auftragbestEmail = this.email;
      }
        this.csvService.createCSVOnServer(value, this.kundenNummer).subscribe(isCsvCreated => {
            if(isCsvCreated == "true") {
                this.requestSuccesully = true;
            } else {
                this.requestError = true
            }
        })
    }

    /**
     * Reloads the Page when Order is successfully taken
     */
    protected onNew() {
        location.reload();
    }

    protected backToPreviosStep() {
        this.requestError = false;
        this.requestSuccesully = false;
    }



}
