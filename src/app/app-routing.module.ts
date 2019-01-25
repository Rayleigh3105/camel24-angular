import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './modules/home/pages/home.component';
import {KepInputComponent} from './modules/kep-input/pages/kep-input/kep-input.component';
import {ImpressumAgbComponent} from './shared/components/impressum-agb/impressum-agb.component';

const routes: Routes = [
    {
        path:'',
        component: HomeComponent,
    },
    {
        path:'auftrag',
        component: KepInputComponent,
    },
    {
        path: 'impressum',
        component: ImpressumAgbComponent,
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
