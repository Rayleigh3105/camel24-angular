import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {LoaderService} from '../../services/loader-service.service';
import {Subscription} from "rxjs";


@Component({
  selector: 'camel-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnDestroy, OnInit {

  filterKundenNummer: string;
  countData: number;
  subs: Subscription[] = [];


  constructor(public $dashboard: DashboardService, public $httpLoader: LoaderService) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }


  ngOnInit() {
    this.subs.push(this.$dashboard.getAllUser().subscribe(data => {
      this.countData = data.length;
    }));
  }

  /**
   * Filters user with given input
   */
  public filterUsers() {
    this.subs.push(this.$dashboard.findUserByIKundenNummer(this.filterKundenNummer).subscribe());
  }
}
