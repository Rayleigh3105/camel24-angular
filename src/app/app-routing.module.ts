import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './modules/home/pages/home.component';
import {KepInputComponent} from './modules/kep-input/pages/kep-input/kep-input.component';
import {ImpressumAgbComponent} from './shared/components/impressum-agb/impressum-agb.component';
import {AgbnationalComponent} from './shared/components/agbnational/agbnational.component';
import {AgbinternationalComponent} from './shared/components/agbinternational/agbinternational.component';
import {UserDashboardComponent} from './shared/components/user-dashboard/user-dashboard.component';
import {AuthGuard} from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auftrag',
    component: KepInputComponent,
  },
  {
    path: 'impressum',
    component: ImpressumAgbComponent,
  },
  {
    path: 'national',
    component: AgbnationalComponent,
  },
  {
    path: 'international',
    component: AgbinternationalComponent,
  },
  {
    path: 'userdashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
