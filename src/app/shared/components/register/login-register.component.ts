import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../core/models/user/user-model';
import {Message} from 'primeng/api';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KepInputComponent} from '../../../modules/kep-input/pages/kep-input/kep-input.component';
import {LoaderService} from '../../services/loader-service.service';
import {Subscription} from "rxjs";
import {DashboardService} from '../../services/dashboard.service';

@Component({
  selector: 'camel-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent extends KepInputComponent implements OnDestroy {

  /**
   * VARIABLEN
   */
  msgs: Message[] = [];
  subs: Subscription[] = [];

  constructor(protected $authService: AuthService,
              public activeModal: NgbActiveModal,
              private $modalService: NgbModal,
              public $httpLoader: LoaderService,
              $dashboardService: DashboardService,
              cdr: ChangeDetectorRef) {
    super($modalService, cdr, $authService, $dashboardService);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }


  /**
   * Register User in Database
   * @param form - register form
   */
  onRegister(form: NgForm) {
    if (form.valid) {
      let user: User = {
        firstName: form.value.vorname,
        lastName: form.value.nachname,
        firma: form.value.firmenname,
        email: form.value.email,
        adresse: form.value.adresse,
        ort: form.value.ort,
        land: form.value.land,
        telefon: form.value.telefon,
        plz: form.value.plz,
        password: form.value.passwort
      };

      this.subs.push(this.$authService.createUser(user).subscribe(response => {
        if (response !== null) {
          window.scroll(0, 0);

          this.setSessionStorage(response.body);
          // Reset Form
          form.resetForm();
          this.updateNgModelVariablesWithSessionStorage();
          // @ts-ignore
          this.activeModal.close(`Herzlich Wilkommen ${response.body.user.kundenNummer} bei dem Camel-24 Auftrags Online Service`);

        }
      }, error => {
        this.showError(error);
      }));
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
   * Dertermines what happens after Modal has been closed
   */
  onClose() {
    this.activeModal.close();
  }

  /**
   * Set`s SessionStorage for available data
   * @param body
   */
  setSessionStorage(body) {
    if (body.token) {
      // @ts-ignore
      sessionStorage.setItem('x-auth', body.token);
    } else {
      sessionStorage.removeItem('x-auth');
    }
  }

}
