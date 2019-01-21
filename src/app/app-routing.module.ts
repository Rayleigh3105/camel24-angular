import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './modules/home/pages/home.component';
import {KepInputComponent} from './modules/kep-input/pages/kep-input/kep-input.component';
import {LoginRegisterComponent} from './modules/register/pages/login-register/login-register.component';
import {LoginComponent} from './modules/login/pages/login/login.component';

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
    {
        path:'login',
        component: LoginComponent,
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
