import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'camel-session-storage',
  templateUrl: './session-storage.component.html',
  styleUrls: ['./session-storage.component.scss']
})
export class SessionStorageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Removes all existing Session Storage
   */
  public static removeSessionStorage() {
    sessionStorage.removeItem('displayName');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('kundenNummer');
    sessionStorage.removeItem('x-auth');
    sessionStorage.removeItem('zusatz');
    sessionStorage.removeItem('ansprechpartner');
    sessionStorage.removeItem('adresse');
    sessionStorage.removeItem('land');
    sessionStorage.removeItem('plz');
    sessionStorage.removeItem('ort');
    sessionStorage.removeItem('telefon');
    sessionStorage.removeItem('vorname');
    sessionStorage.removeItem('nachname');
    sessionStorage.removeItem('currentUser');
  }

  /**
   * GETTER SESSION STORAGE
   */
  public static getXAuth() {
    return sessionStorage.getItem('x-auth');
  }


}
