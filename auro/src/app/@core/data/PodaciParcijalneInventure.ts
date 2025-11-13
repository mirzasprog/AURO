export interface PodaciParcijalneInventure 
 {
    DatumInventure: string,
    Pv: string,
    Status: string;
    OrgJed: string,
    BrojProdavnice: string,
    BrojDokumenta: string
    Podaci: {
        IznosZaIsplatu: number,
        BrojSati: number,
        BrojDana: number,
        Ime: string,
        Prezime: string,
        BrojIzDESa: number,
        OrgJedUposlenika: string,
        VrstaInventure: string,
        RolaNaInventuri: string
    }[];
};