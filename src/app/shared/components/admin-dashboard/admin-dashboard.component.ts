import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {LoaderService} from '../../services/loader-service.service';


@Component({
    selector: 'camel-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

    filterKundenNummer: string;
    countData: number;


    constructor(public $dashboard: DashboardService,public $httpLoader: LoaderService) {
    }

    ngOnInit() {
        this.$dashboard.getAllUser().subscribe(data => {
            this.countData = data.length;
        });
    }

    /**
     * Filters user with given input
     */
    public filterUsers() {
        this.$dashboard.findUserByIKundenNummer(this.filterKundenNummer).subscribe();
    }


}
