export const prijava = (korisnickoIme, lozinka) => {
  cy.get('[data-testid="unos-korisnicko-ime"]').type(korisnickoIme);
  cy.get('[data-testid="unos-lozinka"]').type(lozinka);
  //cy.get('[data-testid="dugme-prijava"]').submit();
  cy.get('[data-testid="dugme-prijava"]').click();
}
