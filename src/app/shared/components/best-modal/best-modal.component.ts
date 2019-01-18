import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {Order} from '../../../core/models/order/order-model';

@Component({
    selector: 'camel-best-modal',
    templateUrl: './best-modal.component.html',
    styleUrls: ['./best-modal.component.scss']
})
export class BestModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal, private csvService: CsvExportService) {
    }

    ngOnInit() {
    }

    /**
     * Sends data to backend and waits for response and handle it
     * @param value - data from the form
     */
    protected sendData(value){
        this.csvService.createCSVOnServer(this.csvService.map(value))
    }



}
