import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import {User} from '../../../core/models/user/user-model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {LoaderService} from '../../services/loader-service.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'camel-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {


  /**
   * VARIABLEN
   */
  errorMessageSignup: string;
  msgs: Message[] = [];
  subs: Subscription[] = [];

  constructor(private $authService: AuthService, public activeModal: NgbActiveModal, public $httpLoader: LoaderService) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Register User in Database
   * @param form - register form
   */
  onLogin(form: NgForm) {
    if (form.valid) {
      let user: User = {
        kundenNummer: parseInt(form.value.kundennummer),
        password: form.value.passwort
      };

      this.subs.push(this.$authService.loginUser(user).subscribe(response => {
        if (response !== null) {
          window.scroll(0, 0);
          this.setSessionStorage(response.body);

          form.resetForm();
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
