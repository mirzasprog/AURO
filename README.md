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

## ServiceInvoices tablica
Za otklanjanje greške `Invalid object name 'ServiceInvoices'` dodata je DDL skripta i EF Core migracija:
- `data/ServiceInvoices.sql` sadrži SQL Server DDL za ručno kreiranje tablice.
- `migrations/20240601000000_AddServiceInvoices.cs` je EF Core migracija (Up/Down) koja kreira tablicu s osnovnim poljima za račune usluga.

Primjer pokretanja migracije u .NET CLI okruženju:
```bash
# unutar .NET projekta koji koristi AURO.Migrations namespace
 dotnet ef database update 20240601000000_AddServiceInvoices
```
