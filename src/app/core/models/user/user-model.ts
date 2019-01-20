import { Token } from './token-model';

export interface User {
    _id? : number,
    firstName: string;
    lastName: string;
    firmenName: string;
    kundenNummer: number;
    email: string;
    password: string;
    tokens? : [Token],
}