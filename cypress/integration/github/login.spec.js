describe('Github Login', () => {
    it('works', () => {
        cy.visit('https://github.com');

        cy.contains('Sign in').should('be.visible');
    });
});
