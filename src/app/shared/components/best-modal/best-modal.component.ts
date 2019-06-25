import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {LoaderService} from '../../services/loader-service.service';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {DashboardService} from '../../services/dashboard.service';
import {PriceConfig} from '../../../core/models/config/price-config';
import {SumCalculationModel} from "../../../core/models/order/SumCalculationModel";
import {CalculationModel} from "../../../core/models/order/calculation-model";

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
  private calculation: SumCalculationModel = new SumCalculationModel(0);


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

    this.calculatePrice()
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
        return data.type === type && data.time === time
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
      this.calculateZustell()

    })

  }

  /**
   * Calculates Price for Zustell.
   */
  private calculateZustell() {
    let zustellZeit = this.data.zustellZeitVon.substring(0, 2) + "-" + this.data.zustellZeitBis.substring(0, 2);
    // Fetch price
    let price = this.getPriceForTypeAndTime("zustell", zustellZeit);

    // Create Object
    let calculationField: CalculationModel =new CalculationModel("Zustellungszeit", price);

    this.calculation.calculatedFields.push(calculationField);
    this.calculation.sum += +price;
  }
}
