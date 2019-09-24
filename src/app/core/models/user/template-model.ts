import { User } from './user-model';

/**
 * Model class for template.
 */
export class Template {
    _id?: any;
    name: string;
    empfaenger: User;

    constructor() {
        this.empfaenger = {};
    }
}