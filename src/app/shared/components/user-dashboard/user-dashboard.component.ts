import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {SessionStorageComponent} from '../session-storage/session-storage.component';

@Component({
    selector: 'camel-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent extends SessionStorageComponent implements OnInit {

    /**
     * VARIABLES
     */
        // NGMODEL
    public sessionVorname: string;
    public sessionNachname: string;
    public sessionFirmenName: string;
    public sessionKundenNummer: string;
    public sessionAdresse: string;
    public sessionLand: string;
    public sessionPlz: string;
    public sessionOrt: string;
    public sessionTelefon: string;
    public sessionEmail: string;

    constructor(public $httpLoader: LoaderService) {
        super();
    }

    ngOnInit() {
        this.updateNgModelVariablesWithSessionStorage()
    }

    /**
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     */
    updateNgModelVariablesWithSessionStorage() {
        this.sessionKundenNummer = this.getKundennummer();
        this.sessionFirmenName = this.getFirmenname();
        this.sessionAdresse = this.getAdresse();
        this.sessionLand = this.getLand();
        this.sessionPlz = this.getPlz();
        this.sessionOrt = this.getOrt();
        this.sessionTelefon = this.getTelefon();
        this.sessionEmail = this.getEmail();
        this.sessionNachname = this.getNachname();
        this.sessionVorname = this.getVorname();
    }

}
