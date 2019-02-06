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
    sessionStorage.removeItem('vorname');
    sessionStorage.removeItem('nachname');
  }

  /**
   * GETTER SESSION STORAGE
   */
  public static getXAuth() {
    return sessionStorage.getItem('x-auth');
  }

  public static getKundennummer() {
    return sessionStorage.getItem('kundenNummer');
  }

  public static getFirmenname() {
    return sessionStorage.getItem('firmenName');
  }

  public static getZusatz() {
    return sessionStorage.getItem('zusatz');
  }

  public static getAnsprechpartner() {
    return sessionStorage.getItem('anprechpartner');
  }

  public static getAdresse() {
    return sessionStorage.getItem('adresse');
  }

  public static getLand() {
    return sessionStorage.getItem('land');
  }

  public static getPlz() {
    return sessionStorage.getItem('plz');
  }

  public static getOrt() {
    return sessionStorage.getItem('ort');
  }

  public static getTelefon() {
    return sessionStorage.getItem('telefon');
  }

  public static getEmail() {
    return sessionStorage.getItem('email');
  }
  public static getVorname() {
      return sessionStorage.getItem('vorname');
  }
  public static getNachname() {
    return sessionStorage.getItem('nachname');
  }


}
