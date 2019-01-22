import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestModalComponent } from './components/best-modal/best-modal.component';
import { SessionStorageComponent } from './components/session-storage/session-storage.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BestModalComponent, SessionStorageComponent]
})
export class SharedModule { }
