import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './modules/home/pages/home.component';
import {KepInputComponent} from './modules/kep-input/pages/kep-input/kep-input.component';
import {LoginRegisterComponent} from './modules/login-register/pages/login-register/login-register.component';

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
        path:'register',
        component: LoginRegisterComponent,
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
