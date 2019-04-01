import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {ActivatedRoute} from '@angular/router';
import {Message} from 'primeng/api';

import {saveAs as importedSaveAs} from 'file-saver';


@Component({
  selector: 'camel-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {

    kundenNummer: string;

    /**
     * VARIABLES
     */
    msgs: Message[] = [];
    msgsDialog: Message[] = [];


    displayDialog: boolean;
    filterIdent: string;
    order: any;
    header: string;

  constructor(public $dashboard: DashboardService, private route: ActivatedRoute) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
        this.kundenNummer = params.kundenNummer
      });
      this.$dashboard.getOrdersForKundenNummer(this.kundenNummer).subscribe();
  }
    /**
     * Get´s fired when row is selected
     * - clones order
     * - opens up info modal with values from row
     * @param event
     */
    onRowSelect(event) {
        this.order = this.cloneOrder(event.data);
        this.header = `Auftragsdetails für Paket: ${this.order.identificationNumber}`;
        this.displayDialog = true;
    }

    /**
     * Clones currently selected order
     * @param cloneOrder - order to clone
     */
    cloneOrder(cloneOrder): any {
        let order = {};
        for (let prop in cloneOrder) {
            order[prop] = cloneOrder[prop];
        }
        return order;
    }

    /**
     * Download PDF
     */
    downloadPdf() {
        this.$dashboard.downloadPdf(this.order.identificationNumber).subscribe(blob => {
            if (blob) {
                importedSaveAs(blob, `Paketlabel - ${this.order.identificationNumber}.pdf`);
            }
        }, error => {
            this.showErrorDialog();
        });
    }

    /**
     * Shows p-message component after error has been thrown
     */
    showErrorDialog() {
        this.msgsDialog = [];
        this.msgsDialog.push({
            severity: 'error',
            summary: 'Camel-30',
            detail: 'Beim downloaden der PDF Datei ist etwas schiefgelaufen.'
        });
    }

}
