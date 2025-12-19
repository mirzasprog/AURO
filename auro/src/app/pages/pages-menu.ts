import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  //Radna ploča [0]
  {
    title: "Radna ploča",
    icon: "browser-outline",
    link: "/pages/pocetna-stranica/radna-ploca"
  },
  {
    title: "Dnevni zadaci",
    icon: "checkmark-circle-outline",
    link: "/pages/dnevni-zadaci"
  },
  //Otpis -- rola: prodavnica [1]
  {
    title: "Otpis",
    icon: "calendar-outline",
    children: [
      {
        title: "Redovni",
        icon: "checkmark-square-2-outline",
        children: [
          {
            title: "Novi redovni otpis",
            link: "/pages/otpis/redovni/novi"
          },
          {
            title: "Pregled redovnih otpisa",
            link: "/pages/otpis/redovni"
          },
          {
            title: "Nema otpisa",
            link: "/pages/otpis/nema-otpisa"
          },
        ],
      },
      {
        title: "Vanredni",
        icon: "close-square-outline",
        children: [
          {
            title: "Novi vanredni otpis",
            link: "/pages/otpis/vanredni/novi",
          },
          {
            title: "Pregled vanrednih otpisa",
            link: "/pages/otpis/vanredni",
          },
        ],
      },
    ]
  },
  //Inventura -- rola: prodavnica [unos], podrucni [odobrenje], interna [pregled] [2]
  {
    title: "Inventure",
    icon: "file-text-outline",
    children: [
      {
        title: "Pregled",
        icon: "search-outline",
        link: "/pages/inventura/pregled"
      },
      {
        title: "Unos",
        icon: "file-add-outline",
        link: "/pages/inventura/parcijalne-inv"
      },
    ]
  },
  //Zahtjevi -- rola: podrucni [prvi nivo odobrenja], regionalni direktor [drugi nivo odobrenja] [3]
  {
    title: "Zahtjevi",
    icon: "question-mark-circle-outline",
    children: [
      {
        title: "Redovni Otpis",
        link: "/pages/zahtjevi/redovni-otpis",
        icon: "calendar-outline"
      },
      {
        title: "Vanredni Otpis",
        link: "/pages/zahtjevi/vanredni-otpis",
        icon: "layout-outline"
      },
      {
        title: "Izdatnice Troška",
        link: "/pages/zahtjevi/izdatnice-troska",
        icon: "share-outline"
      },
    ]
  },
  //Pregled -- rola: interna kontrola [4]
  {
    title: "Pregled",
    icon: "copy-outline",
    children: [
      {
        title: "Redovni Otpisi",
        link: "/pages/pregled/redovni-otpis"
      },
      {
        title: "Vanredni Otpisi",
        link: "/pages/pregled/vanredni-otpis"
      },
      {
        title: "Neuslovna Roba",
        link: "/pages/pregled/neuslovna-roba"
      },
      {
        title: "Izdatnice Troška",
        link: "/pages/pregled/izdatnice-troska"
      },
      {
        title: "Prodavnice bez otpisa",
        link: "/pages/pregled/prodavnica-bez-otpisa"
      },
      /**  {
          title:"Dinamika redovnog otpisa",
          link:"/pages/pregled/dinamika-otpisa" 
        }, */
      /*   {
           title:"Kontrolne Inventure",
           link:"/pages/pregled/kontrolne-inventure"
         },
         */
    ]
  },
  //Unos Datuma -- rola: interna kontrola [5]
  {
    title: "Datumi",
    icon: "calendar-outline",
    children: [
      {
        title: "Redovni otpis",
        icon: "archive-outline",
        link: "/pages/unos-datuma-redovnog-otpisa",
      },
      {
        title: "Odobrenje inventure",
        icon: "brush-outline",
        link: "/pages/unos-datuma-inventure",
      }
    ]
  },
  //Pregled dinamike redovnih otpisa -- rola: interna kontrola [6]
  {
    title: "Pregled dinamike otpisa",
    icon: "options-2-outline",
    link: "/pages/pregled/dinamika-otpisa"
  },
  // Pregled završenih zahtjeva -- rola: podrucni voditelj, regionalni direktor [7]
  {
    title: "Završeni zahtjevi",
    icon: "checkmark-square-outline",
    children: [
      {
        title: "Redovni Otpis",
        icon: "calendar-outline",
        link: "/pages/zahtjevi/zavrseni-redovni-otpis"
      },
      {
        title: "Vanredni Otpis",
        icon: "layout-outline",
        link: "/pages/zahtjevi/zavrseni-vanredni-otpis"
      },
    ]
  },  
  // Akcije -- rola: prodavnica [8]
  { 
    title: "Akcije",
    icon: "pricetags-outline",
    link: "/pages/akcije-unos"
  },
  {
    title: "Vikend akcije",
    icon: "shopping-bag-outline",
    link: "/pages/vikend-akcije"
  },
  {
    title: "Prodajne pozicije",
    icon: "grid-outline",
    link: "/pages/prodajne-pozicije"
  },
  //Reklamacija kvaliteta Voća i povrća -- rola: prodavnica [8], kontrolaKvaliteta
  {
    title: "Kvaliteta VIP-a",
    icon: "swap-outline",
    link: "/pages/kvalitetaVIP"
  },
  /**  TEMP
    {
    title: "Fakturisanje usluga",
    icon: "file-text-outline",
    link: "/pages/fakturisanje-usluga"
  }, */
];
