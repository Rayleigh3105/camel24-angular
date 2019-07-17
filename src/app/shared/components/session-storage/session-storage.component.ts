import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'camel-session-storage',
  templateUrl: './session-storage.component.html',
  styleUrls: ['./session-storage.component.scss']
})
export class SessionStorageComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit() {
  }

  /**
   * Removes all existing Session Storage
   */
  public removeSessionStorage() {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('displayName');
      window.sessionStorage.removeItem('email');
      window.sessionStorage.removeItem('kundenNummer');
      window.sessionStorage.removeItem('x-auth');
      window.sessionStorage.removeItem('zusatz');
      window.sessionStorage.removeItem('ansprechpartner');
      window.sessionStorage.removeItem('adresse');
      window.sessionStorage.removeItem('land');
      window.sessionStorage.removeItem('plz');
      window.sessionStorage.removeItem('ort');
      window.sessionStorage.removeItem('telefon');
      window.sessionStorage.removeItem('vorname');
      window.sessionStorage.removeItem('nachname');
      window.sessionStorage.removeItem('currentUser');
    }

  }

  /**
   * GETTER SESSION STORAGE
   */
  public getXAuth() {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem('x-auth');
    }
  }

}
