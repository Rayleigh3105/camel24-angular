import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginRegisterComponent} from '../../shared/components/register/login-register.component';
import {LoginComponent} from '../../shared/components/login/login.component';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {SessionStorageComponent} from '../../shared/components/session-storage/session-storage.component';
import {Message} from 'primeng/api';
import {Subscription} from "rxjs";

@Component({
    selector: 'camel-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends SessionStorageComponent implements OnInit, OnDestroy {

    /**
     * VARIABLEN
     */
    public boolCheckIfLoggedIn: boolean = false;
    public displayName: String;
    public kundenNummer: String;
    public role: any;
    private subs : Subscription[];
    msgs: Message[] = [];


    constructor(private modalService: NgbModal, private $authService: AuthService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.checkIfLoggedIn();
    }

  ngOnDestroy(): void {
      this.subs.forEach( sub => sub.unsubscribe());
  }


    /**
     * Checks if User is logged in based on the values in the session storage
     */
    public checkIfLoggedIn() {
        if (SessionStorageComponent.getXAuth() !== null) {
            this.$authService.getCurrentUser().then(user => {
                    this.displayName = user.firstName + " " + user.lastName;
                    this.kundenNummer = user.kundenNummer.toString();
                    this.role = user.role;

                }
            );
            this.boolCheckIfLoggedIn = true;
        } else {
            this.boolCheckIfLoggedIn = false;
        }
    }

    /**
     * Opens the Register user Modal
     */
    onRegisterOpenModal() {
        const modalRef = this.modalService.open(LoginRegisterComponent, {
            size: 'lg',
            backdrop: 'static',
            centered: true,
            keyboard: false
        });

        modalRef.result.then(detailsText => {
            if (detailsText) {
                this.checkIfLoggedIn();
                this.showSuccess(detailsText);

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
        modalRef.result.then(detailsText => {
            if (detailsText) {
                this.checkIfLoggedIn();
                this.showSuccess(detailsText);
            }
        });
    }

    /**
     * LOGOUT USER - REMOVES TOKEN IN DATABASE
     */
    logoutUser() {
        // Removes Session Storage
        SessionStorageComponent.removeSessionStorage();
        this.checkIfLoggedIn();
        this.subs.push(this.$authService.logoutUser().subscribe());
        this.router.navigate(['']);
    }

    /**
     * Shows p-message component after succes of registration
     */
    showSuccess(detailsText) {
        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: detailsText
        });
    }
}
