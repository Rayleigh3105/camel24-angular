import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';

@Component({
  selector: 'camel-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(public $dashboard: DashboardService) { }

  ngOnInit() {
      this.$dashboard.getAllUser().subscribe();
  }

    openDialogOrders(kundenNummer: string) {
      this.$dashboard.getOrdersForUser()
    }

}
