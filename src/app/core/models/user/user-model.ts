import { Token } from './token-model';

export interface User {
    _id? : any,
    firstName?: string;
    lastName?: string;
    firmenName?: string;
    kundenNummer?: number;
    email?: string;
    password?: string;
    adresse?: string
    ort?: string
    plz?: string;
    land?: string;
    telefon?: string;
    zusatz?:string;
    ansprechpartner?: string,
    tokens? : [Token],
}