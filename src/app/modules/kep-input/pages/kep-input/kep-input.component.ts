import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from '../../../../shared/components/best-modal/best-modal.component';
import {NgForm} from '@angular/forms';
import {SessionStorageComponent} from '../../../../shared/components/session-storage/session-storage.component';
import {AuthService} from '../../../../shared/services/auth.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'camel-kep-input',
  templateUrl: './kep-input.component.html',
  styleUrls: ['./kep-input.component.scss']
})
export class KepInputComponent extends SessionStorageComponent implements OnInit {

  /**
   * VARIABLES
   */
  public minDate: Date = new Date();
  public maxDate: Date = new Date();
  public abholDatum1: Date = new Date();
  public zustellDatum1: Date = new Date();
  public shouldManuellDisplayed: boolean = false;
  public deAbholZeit: any;
  public showDialog: boolean = false;
  public requestSuccessfully: boolean = false;
  public requestError: boolean = false;
  public abholErrorMessage: string;
  public zustellErrorMessage: string;

  // NGMODEL
  public sessionFirmenName: string;
  public sessionKundenNummer: string;
  public sessionZusatz: string;
  public sessionAnsprechpartner: string;
  public sessionAdresse: string;
  public sessionLand: string;
  public sessionPlz: string;
  public sessionOrt: string;
  public sessionTelefon: string;
  public sessionEmail: string;
  public landSelected: string = 'Deutschland';
  public rechnungSelected: string = 'absender';
  public artSelected: string = 'Waffe';
  public kiloSelected: string = '3';
  public versicherungSelected: string = 'Nein';
  public zustellungsTerminSelected: string = 'Standardzustellungstermin';
  public sonderdienstSelected: string = 'Standardzustellung';
  public abholZeitVon1: string = '08:00';
  public abholZeitBis1: string = '16:00';
  public zustellZeitVon1: string = '08:00';
  public zustellZeitBis1: string = '16:00';

  constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef, $authService: AuthService) {
    super();
    // Get user Infos
    $authService.getCurrentUser().then(body => {
      this.setSessionStorage(body);
      // Update NgModel Variables
      this.updateNgModelVariablesWithSessionStorage();
    });
  }

  ngOnInit() {
    window.scroll(0, 0);

    // Set´s up PrimeNg Date Picker
    this.setupAbholZeitDatePicker();

    let interval = setInterval(() => {
      if (SessionStorageComponent.getXAuth() !== null) {
        this.updateNgModelVariablesWithSessionStorage();
        if (this.sessionFirmenName !== null) {
          clearInterval(interval);
        }
      }

    }, 1000);
  }

  /**
   * Set´s up Datepicker logic for PrimeNG component
   */
  setupAbholZeitDatePicker() {
    this.deAbholZeit = {
      firstDayOfWeek: 0,
      dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      dayNamesShort: ['Son', 'Mon', 'Die', 'Mit', 'Do', 'Fri', 'Sam'],
      dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Heute',
      clear: 'Löschen',
      dateFormat: 'dd.mm.yy'
    };

    let today = new Date();
    today.setDate(today.getDate() + 5);

    if (today.getDay() === 3 || today.getDay() === 2 || today.getDay() === 1) {
      // Montag, Dienstag, Mittwoch
      this.minDate.setDate(today.getDate() +1 );
      this.maxDate.setDate(this.minDate.getDate() + 14);

    } else if (today.getDay() === 4) {
      // Donnerstag
      this.minDate.setDate(today.getDate() +1 );
      this.maxDate.setDate(today.getDate() + 14);

    } else if (today.getDay() === 5) {
      // Freitag
      this.minDate.setDate(today.getDate() + 3);
      this.maxDate.setDate(today.getDate() + 16);

    } else if (today.getDay() === 6) {
      // Samstag
      this.minDate.setDate(today.getDate() + 2);
      this.maxDate.setDate(today.getDate() + 13);
    } else if (today.getDay() === 0) {
      // Sonntag
      this.minDate.setDate(today.getDate() + 1);
      this.maxDate.setDate(today.getDate() + 12);
    }

    if (this.minDate.getDay() === 5) {
      this.zustellDatum1.setDate(this.minDate.getDate() + 3);
    } else {
      this.zustellDatum1.setDate(this.minDate.getDate() + 1);
    }


  }

  /**
   * Checks if given string matches 'manuell' if yes a new input group is displayed
   * @param auftragsBestValue
   */
  onOptionAuftragsBestChange(auftragsBestValue: string) {
    this.shouldManuellDisplayed = auftragsBestValue === 'manuell';
  }

  /**
   * When Form is valid and KundenNummer is given opens the Confirmation Modal
   * @param form - form which is submitted
   */
  onSubmit(form: NgForm) {

    if (this.checkValidAbholZeitfenster(form) && this.checkValidZustellZeitFenster(form) && form.form.valid) {
      const modalref = this.modalService.open(BestModalComponent, {
        size: 'lg',
        backdrop: 'static',
        centered: true,
        keyboard: false
      });

      // Set SessionStorage Variable for Modal use
      if (form.value.kundenNummer) {
        sessionStorage.removeItem('kundenNummer');
        sessionStorage.setItem('kundenNummer', form.value.kundenNummer);
      }
      // Delete KundenNummer from request body because it going to be sent with headers
      delete form.value.kundenNummer;
      // Delete Check from request body because it isnt needed for the request
      delete form.value.check;
      modalref.componentInstance.data = form.value;
      modalref.result.then(result => {
        if (result) {
          form.resetForm();
          this.cdr.detectChanges();
          this.updateNgModelVariablesWithSessionStorage();
          this.requestSuccessfully = true;

        } else {
          this.requestError = true;
        }
      });
    }
  }

  /**
   * Updated ngModel Attributes in Template with data given in Sessionstorage
   * Also updates Selected Values in form with default values
   */
  updateNgModelVariablesWithSessionStorage() {
    // SELECTED VALUES
    this.landSelected = 'Deutschland';
    this.rechnungSelected = 'absender';
    this.artSelected = 'Waffe';
    this.kiloSelected = '3';
    this.versicherungSelected = 'Nein';
    this.zustellungsTerminSelected = 'Standardzustellungstermin';
    this.sonderdienstSelected = 'Standardzustellung';

    //  SESSION VALUES
    this.sessionKundenNummer = SessionStorageComponent.getKundennummer();
    this.sessionFirmenName = SessionStorageComponent.getFirmenname();
    this.sessionZusatz = SessionStorageComponent.getZusatz();
    this.sessionAnsprechpartner = SessionStorageComponent.getAnsprechpartner();
    this.sessionAdresse = SessionStorageComponent.getAdresse();
    this.sessionLand = SessionStorageComponent.getLand();
    this.sessionPlz = SessionStorageComponent.getPlz();
    this.sessionOrt = SessionStorageComponent.getOrt();
    this.sessionTelefon = SessionStorageComponent.getTelefon();
    this.sessionEmail = SessionStorageComponent.getEmail();
  }

  /**
   * Opens info Modal - user is now able to view how the App is working
   */
  openInfoModal() {
    this.showDialog = true;
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
   * Checks if AbholZeit is valid
   * @param form
   */
  private checkValidAbholZeitfenster(form: NgForm): boolean {
    let abholZeitVon = +form.value.abholZeitVon.substr(0, form.value.abholZeitVon.indexOf(':'));
    let abholZeitBis = +form.value.abholZeitBis.substr(0, form.value.abholZeitVon.indexOf(':'));

    if (abholZeitVon > abholZeitBis) {
      this.abholErrorMessage = 'Abholzeit \'von\' ist später als \'bis\' Abholzeit.';
      return false;
    } else if (!(abholZeitBis - 2 >= abholZeitVon)) {
      this.abholErrorMessage = 'Abholzeitfenster muss mind. 2 Stunden betragen.';
      return false;
    } else {
      this.abholErrorMessage = null;
      return true;
    }
  }

  /**
   * Checks if AbholZeit is valid
   * @param form
   */
  private checkValidZustellZeitFenster(form: NgForm): boolean {
    let zustellZeitVon = +form.value.zustellZeitVon.substr(0, form.value.abholZeitVon.indexOf(':'));
    let zustellZeitBis = +form.value.zustellZeitBis.substr(0, form.value.abholZeitVon.indexOf(':'));

    if (zustellZeitVon > zustellZeitBis) {
      this.zustellErrorMessage = 'Zustellzeit \'von\' ist später als \'bis\' Zustellzeit.';
      return false;
    } else if (!(zustellZeitBis - 2 >= zustellZeitVon)) {
      this.zustellErrorMessage = 'Zustellzeitfenster muss mind. 2 Stunden betragen.';
      return false;
    } else {
      this.zustellErrorMessage = null;
      return true;
    }
  }
}
