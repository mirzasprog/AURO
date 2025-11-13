export interface Zaposlenici {
        orgJed: string;
        nazivOrg?: string;
        format?: string;
        entitet?: string;
        brojIzDESa: string;
        ime: string;
        prezime: string;
        naknada?: number;
        iznosZaIsplatu?: number;
        pv: string;
        brojSati: number;
        brojDana?: number;
        datumInventure?: string;
        datumUnosa?: string;
        locked?: boolean;  
}