import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginRegisterComponent} from '../../modules/register/pages/login-register/login-register.component';

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

    protected checkIfLoggedIn() {
        if (sessionStorage.getItem('x-auth') !== null) {
            this.firmenName = sessionStorage.getItem('firmenName');
            this.kundenNummer = sessionStorage.getItem('kundenNummer');

            this.boolCheckIfLoggedIn = true;
        }
    }

    onRegister() {
        const modalRef = this.modalService.open(LoginRegisterComponent,{
            size: 'lg'
        });
    }
}
