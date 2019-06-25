import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {LoaderService} from '../../services/loader-service.service';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {DashboardService} from '../../services/dashboard.service';
import {PriceConfig} from '../../../core/models/user/price-config';

@Component({
    selector: 'camel-best-modal',
    templateUrl: './best-modal.component.html',
    styleUrls: ['./best-modal.component.scss']
})
export class BestModalComponent implements OnInit, OnDestroy {

    @Input('data') data: any;
    /**
     * VARIABLEN
     */
    public kundenNummer: string;
    public email: string;
    protected priceConfig : PriceConfig[];
    subs: Subscription[] = [];

    constructor(public activeModal: NgbActiveModal,
                private csvService: CsvExportService,
                public $httpLoader: LoaderService,
                private $authService: AuthService,
                private $dashboard: DashboardService) {
    }

    ngOnInit() {
        this.$authService.getCurrentUser().then(user => {
            this.kundenNummer = user.kundenNummer.toString();
        });
        // Get price Config
        this.subs.push(this.$dashboard.getPriceConfig().subscribe((price) => {
            this.priceConfig = price;
        }))

        this.getPriceForTypeAndTime("zustell","14-17");
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }


    /**
     * Sends data to backend and waits for response and handle it
     * @param value - data from the form
     */
    public sendData(value) {
        if (this.email) {
            value.auftragbestEmail = this.email;
        }
        this.subs.push(this.csvService.createCSVOnServer(value, this.kundenNummer).subscribe(response => {
            if (response == 'true') {
                this.activeModal.close(true);
            } else {
                this.activeModal.close(response);
            }
        }, error => {
            this.activeModal.close(false);
        }));
    }

    private getPriceForTypeAndTime(type : string, time: string): String {
        if(this.checkIfUndefindedOrEmpty(type) && this.checkIfUndefindedOrEmpty(time)) {
            let price = this.priceConfig.find( (data) => {
                return data.type === type && data.time === time
            });
            console.log(price)
            return price.price;

        } else {
            console.log("Es konnte kein preis für diesen typ gefunden werden.")
        }
    }

    /**
     * Check if String is undefined, empty or null
     * @param value
     */
    private checkIfUndefindedOrEmpty(value: string): boolean {
        return value !== '' || value !== null || value !== undefined;
    }
}
