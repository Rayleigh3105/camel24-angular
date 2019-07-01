import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {LoaderService} from '../../services/loader-service.service';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {DashboardService} from '../../services/dashboard.service';
import {PriceConfig} from '../../../core/models/config/price-config';
import {SumCalculationModel} from '../../../core/models/order/SumCalculationModel';
import {CalculationModel} from '../../../core/models/order/calculation-model';

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
    protected priceConfig: PriceConfig[];
    subs: Subscription[] = [];
    protected calculation: SumCalculationModel = new SumCalculationModel(0);


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

        this.calculatePrice();
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

        value.price = this.calculation.sum;

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

    /**
     * <p>Return the price based on the {@link string} type or {@link string} time</p>
     * <i>Returns null when no config could be found
     *
     * @param type - {@link string} type which will get searched in the priceConfigs.
     * @param time - {@link string} time which will get searched in the priceConfigs.
     */
    private getPriceForTypeAndTime(type: string, time: string): string {
        if (BestModalComponent.checkIfUndefindedOrEmpty(type) && BestModalComponent.checkIfUndefindedOrEmpty(time)) {
            let price = this.priceConfig.find((data) => {
                return data.type === type && data.time === time;
            });
            return price.price;
        } else {
            return null;
        }
    }

    /**
     * Check if String is undefined, empty or null
     * @param value
     */
    private static checkIfUndefindedOrEmpty(value: string): boolean {
        return value !== '' || value !== null || value !== undefined;
    }

    private async calculatePrice() {
        // Get price Config
        await this.$dashboard.getPriceConfig().subscribe(price => {
            this.priceConfig = price;

            // Calculate Zustell
            this.calculateZustell();
            // Calculate Abhol
            this.calculateAbhol();
            this.calculation.sum = +this.calculation.sum.toFixed(2);

        });

    }

    /**
     * Calculates Price for Zustell.
     */
    private calculateZustell() {
        let zustellZeit = this.data.zustellZeitVon.substring(0, 2) + '-' + this.data.zustellZeitBis.substring(0, 2);
        // CALCULATE ZUSTELL ZEIT
        // Fetch price
        let price = +this.getPriceForTypeAndTime('zustell', zustellZeit);
        // Create Object
        let calculationField: CalculationModel = new CalculationModel('Zustellungszeit', price.toFixed(2));
        this.calculation.calculatedFields.push(calculationField);

        // CALCULATE ZUSTELL DATUM
        let priceZustellDatum = 0;
        if (this.data.zustellDatum.getDay() == 6) {
            // Date is saturday
            priceZustellDatum = +this.getPriceForTypeAndTime('zustell', 'samstag');
            let calculationField: CalculationModel = new CalculationModel('Samstagszustellung', priceZustellDatum.toFixed(2));
            this.calculation.calculatedFields.push(calculationField);
        }

        // CALCULATE ZUSTELL NACHNAHME
        let priceZustellNachnahme = 0;
        if (this.data.zustellNachnahmeWert) {
            priceZustellNachnahme = +this.getPriceForTypeAndTime('nachnahme', '');
            this.calculation.calculatedFields.push(new CalculationModel('Bar Nachnahme', priceZustellNachnahme.toFixed(2)));
        }

        // CALCULATE ZUSTELL IDENT
        let priceZustellIdent = 0;
        if (this.data.zustellArt == 'persoenlichIdent') {
            priceZustellIdent = +this.getPriceForTypeAndTime('ident', '');
            this.calculation.calculatedFields.push(new CalculationModel('Identprüfung', priceZustellIdent.toFixed(2)));
        }

        this.calculation.sum += +(+price + +priceZustellDatum + +priceZustellNachnahme + +priceZustellIdent).toFixed(2);
    }

    /**
     * Calculate price for Abhol:
     * <ul>
     *     <li>Abholzeit</li>
     *     <li>Versicherung</li>
     * </ul>
     */
    private calculateAbhol() {
        let abholZeit = this.data.abholZeitVon.substring(0, 2) + '-' + this.data.abholZeitBis.substring(0, 2);

        let price = +this.getPriceForTypeAndTime('abhol', abholZeit);

        // Create calculation object for zustellzeit
        let calculatiionField: CalculationModel = new CalculationModel('Abholungszeit', price.toFixed(2));
        this.calculation.calculatedFields.push(calculatiionField);

        // Calculate Versicherung
        let priceVersicherung = 0;
        if (this.data.sendungsdatenVers && this.data.sendungsdatenWert) {
            priceVersicherung = +this.getPriceForTypeAndTime('versicherung', '');

            priceVersicherung += ((Math.round(this.data.sendungsdatenWert / 1000) * 1000) / 1000) * price;
            let calculationField: CalculationModel = new CalculationModel('Transportversicherung', priceVersicherung.toFixed(2));
            this.calculation.calculatedFields.push(calculationField);

        }
        this.calculation.sum += +price + priceVersicherung;
    }
}
