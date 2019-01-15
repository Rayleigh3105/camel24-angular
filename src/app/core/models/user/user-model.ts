import { Token } from './token-model';

export interface User {
    _id? : number,
    firstName: string;
    lastName: string;
    kndNumber: number;
    email: string;
    password: string;
    tokens? : [Token],
}