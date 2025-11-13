export interface Zaposlenici {
        orgJed: string;
        nazivOrg?: string;
        format?: string;
        entitet?: string;
        brojIzDESa: string;
        ime: string;
        prezime: string;
        rola?: string;
        naknada?: number;
        iznosZaIsplatu?: number;
        pv: string;
        brojSati: number;
        brojDana?: number;
        brojMinuta?: number;
        datumInventure?: string;
        vrstaInventure?: string;
        datumUnosa?: string;
        locked?: boolean;  
}