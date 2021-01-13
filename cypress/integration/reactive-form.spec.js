describe('reactive-form example', () => {
    beforeEach(() => {
        cy.visit('./examples/reactive-form/reactive-form.html');
    });

    it('captions must be rendered correctly.', () => {
        cy.get('h1')
            .should('contain', 'Create an account');

        cy.get('button.appButton')
            .should('contain', 'Next');
    });

    it('shoud render three input box', () => {
        cy.get('input')
            .should('have.length', 3);
    });

    it('shoud display error when the button is just clicked', () => {
        cy.get('button.appButton')
            .click();

        cy.get('.appInput__error')
            .should('be.visible')
            .should('have.length', 3);
    });

    it('username shoud validate the form properly', () => {
        cy.get('input')
            .eq(0)
            .type('A');

        cy.get('button.appButton').click();
        cy.get('.appInput__error')
            .eq(0)
            .should('contain', 'Username should be atleast 3 characters long!');

        cy.get('input')
            .eq(0)
            .type('lex');
        cy.get('button.appButton')
            .click();
        cy.get('.appInput__error')
            .eq(0)
            .should('contain', '');
    });

    it('email shoud validate the form properly', () => {
        cy.get('input')
            .eq(0)
            .type('Alex');

        cy.get('input')
            .eq(1)
            .type('alex');
        cy.get('button.appButton')
            .click();
        cy.get('.appInput__error')
            .eq(1)
            .should('contain', 'Enter a valid e-mail address');

        cy.get('input')
            .eq(1)
            .type('@example.com');
        cy.get('button.appButton')
            .click();
        cy.get('.appInput__error')
            .eq(1)
            .should('contain', '');
    });

    it('password shoud validate the form properly', () => {
        cy.get('input')
            .eq(0)
            .type('Alex');
        cy.get('input')
            .eq(1)
            .type('alex@example.com');

        cy.get('input')
            .eq(2)
            .type('l');
        cy.get('button.appButton')
            .click();
        cy.get('.appInput__error')
            .eq(2)
            .should('contain', 'Password should be atleast 5 characters long!');
    });


    it('on submitting a valid form, success tick mark and the username shoud be displayed', () => {
        cy.get('input')
            .eq(0)
            .type('Alex');
        cy.get('input')
            .eq(1)
            .type('alex@example.com');
        cy.get('input')
            .eq(2)
            .type('letmein123');

        cy.get('button.appButton')
            .click();
        cy.get('app-success-tick')
            .should('have.length', 1);
        cy.get('p')
            .should('contain', 'Welcome Alex!');
    });
});