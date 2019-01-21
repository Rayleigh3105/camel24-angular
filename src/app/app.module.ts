import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './modules/home/pages/home.component';
import {KepInputComponent} from './modules/kep-input/pages/kep-input/kep-input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from './shared/services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {OrderService} from './shared/services/order.service';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    KepInputComponent,
    LoginRegisterComponent,
    MustMatchDirective,
    LoginComponent
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
    MessageModule,
    MessagesModule
  ],
  entryComponents: [BestModalComponent,LoginRegisterComponent, LoginComponent],
  providers: [AuthService, OrderService, CsvExportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
