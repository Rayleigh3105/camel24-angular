import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HeaderComponent} from './layouts/header/header.component';
import {FooterComponent} from './layouts/footer/footer.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './modules/home/pages/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from './shared/services/auth.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CalendarModule, DialogModule} from 'primeng/primeng';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from './shared/components/best-modal/best-modal.component';
import {CsvExportService} from './shared/services/csv-export.service';
import {LoginRegisterComponent} from './shared/components/register/login-register.component';
import {MustMatchDirective} from './shared/directive/mustmatch.directive';

import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {LoginComponent} from './shared/components/login/login.component';
import {KepInputModule} from './modules/kep-input/kep-input.module';
import {LoaderService} from './shared/services/loader-service.service';
import {LoaderInterceptor} from './shared/interceptor/loader-interceptor';
import {AuthGuard} from './shared/guard/auth.guard';
import {UserDashboardComponent} from './shared/components/user-dashboard/user-dashboard.component';
import {DashboardService} from './shared/services/dashboard.service';
import {TableModule} from 'primeng/table';
import {AuthAdminGuard} from './shared/guard/auth-admin.guard';
import {AdminDashboardComponent} from './shared/components/admin-dashboard/admin-dashboard.component';
import {OrderModalComponent} from './shared/components/order-modal/order-modal.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {ConfigurationComponent} from './shared/components/configuration/configuration.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        LoginRegisterComponent,
        MustMatchDirective,
        LoginComponent,
        UserDashboardComponent,
        AdminDashboardComponent,
        OrderModalComponent,
        NotFoundComponent,
        ConfigurationComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CalendarModule,
        ReactiveFormsModule,
        NgbModule,
        KepInputModule,
        MessageModule,
        MessagesModule,
        TableModule,
        DialogModule,
    ],
    entryComponents: [
        BestModalComponent,
        LoginRegisterComponent,
        LoginComponent,
        OrderModalComponent
    ],
    providers: [
        AuthService,
        CsvExportService,
        LoaderService, {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        },
        AuthGuard,
        AuthAdminGuard,
        DashboardService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
