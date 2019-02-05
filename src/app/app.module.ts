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
import {CalendarModule} from 'primeng/primeng';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from './shared/components/best-modal/best-modal.component';
import {CsvExportService} from './shared/services/csv-export.service';
import {LoginRegisterComponent} from './shared/components/register/login-register.component';
import {MustMatchDirective} from './shared/directive/mustmatch.directive';

import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {LoginComponent} from './shared/components/login/login.component';
import {InfoComponent} from './modules/kep-input/pages/info/info.component';
import {KepInputModule} from './modules/kep-input/kep-input.module';
import {LoaderService} from './shared/services/loader-service.service';
import {LoaderInterceptor} from './shared/interceptor/loader-interceptor';
import {AuthGuard} from './shared/guard/auth.guard';
import {UserDashboardComponent} from './shared/components/user-dashboard/user-dashboard.component';
import {DashboardService} from './shared/services/dashboard.service';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        LoginRegisterComponent,
        MustMatchDirective,
        LoginComponent,
        InfoComponent,
        UserDashboardComponent
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
        MessagesModule
    ],
    entryComponents: [
        BestModalComponent,
        LoginRegisterComponent,
        LoginComponent,
        InfoComponent
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
        DashboardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
