import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BestModalComponent} from './components/best-modal/best-modal.component';
import {SessionStorageComponent} from './components/session-storage/session-storage.component';
import {ImpressumAgbComponent} from './components/impressum-agb/impressum-agb.component';
import {AgbnationalComponent} from './components/agbnational/agbnational.component';
import {AgbinternationalComponent} from './components/agbinternational/agbinternational.component';
import {DialogModule} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        DialogModule,
        FormsModule,
        DialogModule
    ],
    declarations: [BestModalComponent, SessionStorageComponent, ImpressumAgbComponent, AgbnationalComponent, AgbinternationalComponent]
})
export class SharedModule {
}
