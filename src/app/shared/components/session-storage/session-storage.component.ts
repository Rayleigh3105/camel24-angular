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
  public removeSessionStorage() {
    sessionStorage.removeItem('firmenName');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('kundenNummer');
    sessionStorage.removeItem('x-auth');
    sessionStorage.removeItem('zusatz');
    sessionStorage.removeItem('anprechpartner');
    sessionStorage.removeItem('adresse');
    sessionStorage.removeItem('land');
    sessionStorage.removeItem('plz');
    sessionStorage.removeItem('ort');
    sessionStorage.removeItem('telefon');
  }

  /**
   * GETTER SESSION STORAGE
   */
  public getXAuth() {
    return sessionStorage.getItem('x-auth');
  }

  public getKundennummer() {
    return sessionStorage.getItem('kundenNummer');
  }

  public getFirmenname() {
    return sessionStorage.getItem('firmenName');
  }

  public getZusatz() {
    return sessionStorage.getItem('zusatz');
  }

  public getAnsprechpartner() {
    return sessionStorage.getItem('anprechpartner');
  }

  public getAdresse() {
    return sessionStorage.getItem('adresse');
  }

  public getLand() {
    return sessionStorage.getItem('land');
  }

  public getPlz() {
    return sessionStorage.getItem('plz');
  }

  public getOrt() {
    return sessionStorage.getItem('ort');
  }

  public getTelefon() {
    return sessionStorage.getItem('telefon');
  }

  public getEmail() {
    return sessionStorage.getItem('email');
  }
  public getVorname() {
      return sessionStorage.getItem('vorname');
  }
  public getNachname() {
    return sessionStorage.getItem('nachname');
  }


}
