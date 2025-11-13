import { prijava } from '../util/prijava'
describe('Korisnik', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:5114')
  })

  it('Interna unosi datum otpisa', () => {
    //cy.visit('http://localhost:5114')
    prijava('azra.henda', 'test123');
    cy.url().should('contain', 'pages/pocetna-stranica/radna-ploca');

    cy.visit('http://localhost:5114/pages/unos-datuma-redovnog-otpisa');
    cy.get('[data-testid="datum-od"]').type('07.02.2023');
    cy.get('[data-testid="datum-do"]').type('10.02.2023');
    cy.get('[data-testid="dugme-primjeni"]').click();

    // cy.get('.animate__animated animate__fadeInDown').should('be.visible');
  }
  );

  it('Prodavnica 0001 vrsi otpis', () => {
    prijava('0001', 'P001P001');
    cy.url().should('contain', 'pages/pocetna-stranica/radna-ploca');

    cy.visit('http://localhost:5114/pages/otpis/redovni/novi');

    cy.get('[data-testid="dropdown-provedeno-snizenje"]').click().get('nb-option').eq(0).click();
    cy.get('[data-testid="dropdown-razlog-otpisa"]').click().get('nb-option').contains('Istek roka trajanja').click();
    cy.get('[data-testid="unos-datum-isteka"]').type('07.02.2023');
    cy.get('[data-testid="unos-sifra"]').type('90336312');
    cy.get('[data-testid="unos-kolicina"]').type('7');
    cy.get('[data-testid="dugme-dodaj-artikal"]').click();

    // cy.get('[data-testid="dropdown-provedeno-snizenje"]').eq(0).select('DA');

    cy.wait(50000).get('[data-testid="dropdown-provedeno-snizenje"]').click().get('nb-option').eq(0).click();
    cy.get('[data-testid="dropdown-razlog-otpisa"]').click().get('nb-option').contains('Istek roka trajanja').click();
    cy.get('[data-testid="unos-datum-isteka"]').clear();
    cy.get('[data-testid="unos-datum-isteka"]').type('14.02.2023');
    cy.get('[data-testid="unos-sifra"]').clear();
    cy.get('[data-testid="unos-sifra"]').type('90444958');
    cy.get('[data-testid="unos-kolicina"]').clear();
    cy.get('[data-testid="unos-kolicina"]').type('14');
    cy.get('[data-testid="dugme-dodaj-artikal"]').click();


    cy.wait(50000).get('[data-testid="dropdown-provedeno-snizenje"]').click().get('nb-option').eq(0).click();
    cy.get('[data-testid="dropdown-razlog-otpisa"]').click().get('nb-option').contains('Istek roka trajanja').click();
    cy.get('[data-testid="unos-datum-isteka"]').clear();
    cy.get('[data-testid="unos-datum-isteka"]').type('18.02.2023');
    cy.get('[data-testid="unos-sifra"]').clear();
    cy.get('[data-testid="unos-sifra"]').type('03160097');
    cy.get('[data-testid="unos-kolicina"]').clear();
    cy.get('[data-testid="unos-kolicina"]').type('9');
    cy.get('[data-testid="dugme-dodaj-artikal"]').click();

    //expect

    // ng2-smart-table[1]/table[1]/tbody[1]/tr[1]/td[2]/ng2-smart-table-cell[1]/table-cell-view-mode[1]/div[1]/div[1]
    //tbody

    //cy.get('.ng2-smart-table-cell-view-mode div div').eq(0).should('have.text', '01310636');
    // //body[1]/ngx-app[1]/ngx-pages[1]/ngx-one-column-layout[1]/nb-layout[1]/div[1]/div[1]/div[1]/div[1]/div[1]/nb-layout-column[1]/ngx-otpisi[1]/ngx-novi-redovni[1]/nb-card[4]/nb-card-body[1]/div[1]/ng2-smart-table[1]/table[1]/tbody[1]/tr[1]/td[3]/ng2-smart-table-cell[1]/table-cell-view-mode[1]
    // cy.get('').eq(0).should('have.text', '01310636');
    //
    cy.wait(50000).get('[data-testid="dugme-spremi"]').click();
    // swal2-confirm swal2-styled swal2-default-outline
    cy.get('button.swal2-confirm.swal2-styled.swal2-default-outline').click();
    // swal2-title
  });
});
