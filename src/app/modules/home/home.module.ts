import { NgModule } from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import {HomeRoutingModule} from './home-routing.module';

@NgModule({
    declarations: [
    ],
    imports: [
        SharedModule,

        HomeRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class HomeModule { }
