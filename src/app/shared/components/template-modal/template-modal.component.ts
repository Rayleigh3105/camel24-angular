import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../core/models/user/user-model';
import {Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CsvExportService} from '../../services/csv-export.service';
import {LoaderService} from '../../services/loader-service.service';
import {AuthService} from '../../services/auth.service';
import {Template} from '../../../core/models/user/template-model';

@Component({
    selector: 'camel-template-modal',
    templateUrl: './template-modal.component.html',
    styleUrls: ['./template-modal.component.scss']
})
export class TemplateModalComponent implements OnInit, OnDestroy {

    @Input('empfaenger') empfaenger: User;

    subs: Subscription[] = [];
    template: Template = new Template();

    constructor(public activeModal: NgbActiveModal,
                private csvService: CsvExportService,
                public $httpLoader: LoaderService,
                private $authService: AuthService,) {
    }

    ////////////////////////////////////////////////
    // LIFECYCLEHOOKS
    ////////////////////////////////////////////////

    ngOnInit() {
        this.template.empfaenger = this.empfaenger;
    }

    ngOnDestroy(): void {
    }

    ////////////////////////////////////////////////
    // PUBLIC METHODS
    ////////////////////////////////////////////////
    createTemplate() {
        this.subs.push(this.csvService.createTemplate(this.template).subscribe(res => this.activeModal.close(false)));
    }


}
