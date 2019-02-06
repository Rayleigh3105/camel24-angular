import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginRegisterComponent} from '../../shared/components/register/login-register.component';
import {LoginComponent} from '../../shared/components/login/login.component';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {SessionStorageComponent} from '../../shared/components/session-storage/session-storage.component';
import {KepInputComponent} from '../../modules/kep-input/pages/kep-input/kep-input.component';

@Component({
  selector: 'camel-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends SessionStorageComponent implements OnInit {

  /**
   * VARIABLEN
   */
  public boolCheckIfLoggedIn: boolean = false;
  public firmenName: String;
  public kundenNummer: String;

  constructor(private modalService: NgbModal, private $authService: AuthService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.checkIfLoggedIn();
  }

  /**
   * Checks if User is logged in based on the values in the session storage
   */
  protected checkIfLoggedIn() {
    let interval;
    if (SessionStorageComponent.getXAuth() !== null) {
      this.firmenName = SessionStorageComponent.getFirmenname();
      this.kundenNummer = SessionStorageComponent.getKundennummer();
      this.boolCheckIfLoggedIn = true;

      interval = setInterval(() => {
        this.checkIfLoggedIn();
      }, 1000);
    } else {
      this.boolCheckIfLoggedIn = false;
      clearInterval(interval);
    }
  }

  /**
   * Opens the Register user Modal
   */
  onRegister() {
    const modalRef = this.modalService.open(LoginRegisterComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      keyboard: false
    });

    modalRef.result.then(reloadHeader => {
      if (reloadHeader) {
        this.checkIfLoggedIn();
      }
    });

  }

  /**
   * Opens the Login user Modal
   */
  onLogin() {
    const modalRef = this.modalService.open(LoginComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      keyboard: false
    });

    // On close reload header
    modalRef.result.then(reloadHeader => {
      if (reloadHeader) {
        this.checkIfLoggedIn();
      }
    });
  }

  /**
   * LOGOUT USER - REMOVES TOKEN IN DATABASE
   */
  logoutUser() {
    this.$authService.logoutUser().subscribe(isDeleted => {
      if (isDeleted) {
        // Removes Session Storage
        this.checkIfLoggedIn();
        SessionStorageComponent.removeSessionStorage();

        // Navigate to Home page
        this.router.navigate(['']);
      }
      SessionStorageComponent.removeSessionStorage();

    });
  }


}
