import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KepInputComponent} from './pages/kep-input/kep-input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule, DialogModule, DropdownModule} from 'primeng/primeng';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        ReactiveFormsModule,
        DialogModule,
        DropdownModule
    ],
    declarations: [KepInputComponent]
})
export class KepInputModule {
}
