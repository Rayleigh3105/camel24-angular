import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'camel-best-modal',
    templateUrl: './best-modal.component.html',
    styleUrls: ['./best-modal.component.scss']
})
export class BestModalComponent implements OnInit {
    /**
     * VARIABLEN
     */
    protected kundenNummer: string;
    protected requestSuccesully: boolean = false;

    constructor(public activeModal: NgbActiveModal, private csvService: CsvExportService) {
    }

    ngOnInit() {
        this.kundenNummer = sessionStorage.getItem('kundenNummer');
    }


    /**
     * Sends data to backend and waits for response and handle it
     * @param value - data from the form
     */
    protected sendData(value){
        this.csvService.createCSVOnServer(value, this.kundenNummer).subscribe(test => console.log("modal" + test))
    }



}
