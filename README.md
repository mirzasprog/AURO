# AURO Vikend Akcije demo

Minimalni Node/Express API i staticki frontend koji demonstrira rad sa VIP zaglavljima i stavkama vikend akcija.

## Pokretanje
1. Instaliraj zavisnosti: `npm install`
2. Pokreni server: `npm start`
3. Otvori `http://localhost:3000` u pregledniku i pristupi ekranu "Vikend Akcije".

API rute:
- `GET /api/vip-zaglavlja` – lista zaglavlja uz broj stavki.
- `GET /api/vip-zaglavlja/:id/stavke` – detalji stavki za odabrano zaglavlje.
- `PUT /api/vip-zaglavlja/:id/stavke` – koriguj količine stavki (JSON niz objekata `{ Id, Kolicina }`).
