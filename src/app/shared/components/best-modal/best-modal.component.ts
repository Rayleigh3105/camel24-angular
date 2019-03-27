import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {LoaderService} from '../../services/loader-service.service';
import {AuthService} from '../../services/auth.service';

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

    constructor(public activeModal: NgbActiveModal, private csvService: CsvExportService, public $httpLoader: LoaderService, private $authService: AuthService) {
    }

    ngOnInit() {
        this.$authService.getCurrentUser().then(user => {
            this.kundenNummer = user.kundenNummer.toString();
        })
    }


    /**
     * Sends data to backend and waits for response and handle it
     * @param value - data from the form
     */
    protected sendData(value){
      if(this.email) {
        value.auftragbestEmail = this.email;
      }
        this.csvService.createCSVOnServer(value, this.kundenNummer).subscribe(response => {
            if(response == "true") {
                this.activeModal.close(true)
            } else {
                this.activeModal.close(response)
            }
        },error => {
            this.activeModal.close(false)
        });
    }
}
