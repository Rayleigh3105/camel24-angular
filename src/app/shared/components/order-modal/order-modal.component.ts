import {Component, Input, OnInit} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {ActivatedRoute} from '@angular/router';
import {Message} from 'primeng/api';

import {saveAs as importedSaveAs} from 'file-saver';
import {LoaderService} from '../../services/loader-service.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {AuthService} from '../../services/auth.service';


@Component({
    selector: 'camel-order-modal',
    templateUrl: './order-modal.component.html',
    styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {
    @Input('kundenNummer') kundenNummerInput: string;


    /**
     * VARIABLES
     */
    msgsDialog: Message[] = [];
    role: string;
    displayDialog: boolean;
    order: any;
    header: string;
    countData: number;
    filterIdent: string;
    currentKundenNummer: string;
    kundenNummer: string;

    constructor(public $dashboard: DashboardService, private route: ActivatedRoute, public $httpLoader: LoaderService, private $auth: AuthService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.kundenNummer = params.kundenNummer;
        });

        this.$auth.getCurrentUser().then(user => {
            this.role = user.role;
        });
        let kundenNummertoSearchWith: string;
        if (this.kundenNummer) {
            kundenNummertoSearchWith = this.kundenNummer;
        } else {
            kundenNummertoSearchWith = this.kundenNummerInput;
        }

        this.$dashboard.getOrdersForKundenNummer(kundenNummertoSearchWith, null).subscribe(data => {
            this.countData = data.length;
            if (data.length != 0) {
                this.currentKundenNummer = data[0].kundenNummer;
            }
        });
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

    /**
     * Filter order with search from input
     */
    public filterOrders() {
        this.$dashboard.getOrdersForKundenNummer( this.currentKundenNummer,this.filterIdent).subscribe(data => {
            this.countData = data.length;
        });
    }
}
