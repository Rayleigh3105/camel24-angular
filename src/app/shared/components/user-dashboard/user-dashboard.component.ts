import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {SessionStorageComponent} from '../session-storage/session-storage.component';
import {NgForm} from '@angular/forms';
import {DashboardService} from '../../services/dashboard.service';
import {User} from '../../../core/models/user/user-model';
import {Message} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {saveAs as importedSaveAs} from 'file-saver';


@Component({
  selector: 'camel-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent extends SessionStorageComponent implements OnInit {

  /**
   * VARIABLES
   */
  msgs: Message[] = [];
  msgsDialog: Message[] = [];


  displayDialog: boolean;
  selectedCar: any;
  order: any;
  header: string;

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
  public sessionZusatz: string;
  public sessionAnsprechpartner: string;

  constructor(public $httpLoader: LoaderService, public $dasboardService: DashboardService, private $authService: AuthService, private ndbModal: NgbModal) {
    super();
  }

  ngOnInit() {
    this.updateNgModelVariablesWithSessionStorage();
    // Get user Infos
    this.$authService.getCurrentUser().then(body => {
      this.setSessionStorage(body);
      this.updateNgModelVariablesWithSessionStorage();
    });
    this.$dasboardService.getOrdersForUser().subscribe();
  }

  /**
   * Updates the user based on the inoputs
   * @param form - form from the frontend
   */
  async onUpdate(form: NgForm) {
    if (form.valid) {
      let userId: string = '';
      await this.$authService.getCurrentUser().then(response => {
        userId = response._id;
      }, error => {
        this.showError(error);
      });
      // Create User object with updated values in it from the form
      let user: User = {
        _id: userId,
        firstName: form.value.vorname,
        lastName: form.value.nachname,
        firmenName: form.value.firmenname,
        email: form.value.email,
        adresse: form.value.adresse,
        ort: form.value.ort,
        land: form.value.land,
        telefon: form.value.telefon,
        plz: form.value.plz,
        zusatz: form.value.zusatz,
        ansprechpartner: form.value.ansprechpartner

      };

      this.$dasboardService.updateUser(user).subscribe(body => {
        if (body !== null) {
          // Set´s SessionStorage variables right
          this.setSessionStorage(body);
          // Updates SessionStorage with ngModel variables
          this.updateNgModelVariablesWithSessionStorage();
          // Shows P-Message
          this.showSuccess(body);
        }
      }, error => {
        this.showError(error);
      });
    }
  }

  /**
   * Shows p-message component after error has been thrown
   */
  showError(error) {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: error.error.errorCode,
      detail: error.error.message
    });
  }

  /**
   * Shows p-message component after error has been thrown
   */
  showErrorDialog(error) {
    this.msgsDialog = [];
    this.msgsDialog.push({
      severity: 'error',
      summary: "Camel-30",
      detail: "Beim downloaden der PDF Datei ist etwas schiefgelaufen."
    });
  }

  /**
   * Shows p-message component after succes of registration
   */
  showSuccess(value) {
    this.msgs = [];
    this.msgs.push({
      severity: 'success',
      summary: 'Erfolgreich',
      detail: `Benutzer wurde erfolgreich gespeichert.`
    });
  }

  /**
   * Updated ngModel Attributes in Template with data given in Sessionstorage
   */
  updateNgModelVariablesWithSessionStorage() {
    this.sessionKundenNummer = SessionStorageComponent.getKundennummer();
    this.sessionFirmenName = SessionStorageComponent.getFirmenname();
    this.sessionAdresse = SessionStorageComponent.getAdresse();
    this.sessionLand = SessionStorageComponent.getLand();
    this.sessionPlz = SessionStorageComponent.getPlz();
    this.sessionOrt = SessionStorageComponent.getOrt();
    this.sessionTelefon = SessionStorageComponent.getTelefon();
    this.sessionEmail = SessionStorageComponent.getEmail();
    this.sessionNachname = SessionStorageComponent.getNachname();
    this.sessionVorname = SessionStorageComponent.getVorname();
    this.sessionAnsprechpartner = SessionStorageComponent.getAnsprechpartner();
    this.sessionZusatz = SessionStorageComponent.getZusatz();
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
   * Set`s SessionStorage for available data
   * @param body
   */
  setSessionStorage(body) {

    if (body.firmenName) {
      // @ts-ignore
      sessionStorage.setItem('firmenName', body.firmenName);
    } else {
      sessionStorage.removeItem('firmenName');
    }

    if (body.email) {
      // @ts-ignore
      sessionStorage.setItem('email', body.email);
    } else {
      sessionStorage.removeItem('email');
    }

    if (body.adresse) {
      // @ts-ignore
      sessionStorage.setItem('adresse', body.adresse);
    } else {
      sessionStorage.removeItem('adresse');
    }

    if (body.ort) {
      // @ts-ignore
      sessionStorage.setItem('ort', body.ort);
    } else {
      sessionStorage.removeItem('ort');
    }

    if (body.land) {
      // @ts-ignore
      sessionStorage.setItem('land', body.land);
    } else {
      sessionStorage.removeItem('land');
    }

    if (body.telefon) {
      // @ts-ignore
      sessionStorage.setItem('telefon', body.telefon);
    } else {
      sessionStorage.removeItem('telefon');
    }

    if (body.plz) {
      // @ts-ignore
      sessionStorage.setItem('plz', body.plz);
    } else {
      sessionStorage.removeItem('plz');
    }

    if (body.firstName) {
      // @ts-ignore
      sessionStorage.setItem('vorname', body.firstName);
    } else {
      sessionStorage.removeItem('vorname');
    }

    if (body.lastName) {
      // @ts-ignore
      sessionStorage.setItem('nachname', body.lastName);
    } else {
      sessionStorage.removeItem('nachname');
    }

    if (body.zusatz) {
      // @ts-ignore
      sessionStorage.setItem('zusatz', body.zusatz);
    } else {
      sessionStorage.removeItem('zusatz');
    }

    if (body.ansprechpartner) {
      // @ts-ignore
      sessionStorage.setItem('ansprechpartner', body.ansprechpartner);
    } else {
      sessionStorage.removeItem('ansprechpartner');
    }
  }

  /**
   * Download PDF
   */
  downloadPdf() {
    this.$dasboardService.downloadPdf(this.order.identificationNumber).subscribe(blob => {
        if (blob) {
          importedSaveAs(blob, `Paketlabel - ${this.order.identificationNumber}.pdf`);
        }
      }, error => {
        this.showErrorDialog(error);
      });
  }
}
