export class AbsEmpf {

    constructor() {
        this.firma = '';
        this.addresse = '';
        this.land = '';
        this.plz = '';
        this.ort = '';
    }

    firma: string;
    zusatz?: string;
    ansprechpartner?: string;
    addresse: string;
    land: string;
    plz: string;
    ort: string;
    telefon?:string
}
