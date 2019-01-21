import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginRegisterComponent} from '../../shared/components/register/login-register.component';
import {LoginComponent} from '../../shared/components/login/login.component';
import {modelGroupProvider} from '@angular/forms/src/directives/ng_model_group';

@Component({
    selector: 'camel-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    /**
     * VARIABLEN
     */
    protected boolCheckIfLoggedIn: boolean = false;
    protected firmenName: String;
    protected kundenNummer: String;

    constructor(private modalService: NgbModal) {
    }

    ngOnInit() {
        this.checkIfLoggedIn();
    }

    /**
     * Checks if User is logged in based on the values in the session storage
     */
    protected checkIfLoggedIn() {
        if (sessionStorage.getItem('x-auth') !== null) {
            this.firmenName = sessionStorage.getItem('firmenName');
            this.kundenNummer = sessionStorage.getItem('kundenNummer');
            this.boolCheckIfLoggedIn = true;
        }
    }

    /**
     * Opens the Register user Modal
     */
    onRegister() {
        const modalRef = this.modalService.open(LoginRegisterComponent,{
            size: 'lg',
            backdrop: 'static',
            centered: true,
            keyboard: false
        });

    }
    /**
     * Opens the Login user Modal
     */
    onLogin() {
        const modalRef = this.modalService.open(LoginComponent,{
            size: 'lg',
            backdrop: 'static',
            centered: true,
            keyboard: false
        });

    }

}
