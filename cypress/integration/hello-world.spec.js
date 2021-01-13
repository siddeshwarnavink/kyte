

describe('hello-world example', () => {
    beforeEach(() => {
        cy.visit('./examples/hello-world/hello-world.html');
    });

    it('title must be displayed', () => {
        cy.get('h1')
            .should('contain', 'Hello world!');
    });

    it('clicking the button shoud change the title', () => {
        cy.get('button').click();

        cy.get('h1')
            .should('contain', 'Title changed!');
    });

    it('count shoud change for each second', () => {
        const initialValue = cy.get('p').root().innerText;
        
        setTimeout(() => {
            cy.get('p')
            .not('contain', initialValue);
        }, 1000);
        
    });
});