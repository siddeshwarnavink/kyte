describe('todo-list example', () => {
    beforeEach(() => {
        cy.visit('./examples/todo-list/todo-list.html');
    });

    it('shoud render elements properly', () => {
        cy.get('h1')
            .should('contain', 'My Todo');
        cy.get('input')
            .should('have.length', 1);
    });

    it('should display three todo initially', () => {
        cy.get('.todo-list-item')
            .should('have.length', 3);
    });

    it('should add a todo to the list', () => {
        cy.get('input')
            .type('Learn Kyte.js');
        cy.get('.add-todo button')
            .click();
        cy.get('.todo-list-item')
            .should('have.length', 4);
    });

    it('should not create a blank todo', () => {
        cy.get('.add-todo button')
            .click();
        cy.get('.todo-list-item')
            .should('have.length', 3);
    });

    it('should display fallback if there is no todo', () => {
        for(let n = 0; n < 3; n ++){
            cy.get('button.remove')
                .eq(0)
                .click();
        }
        cy.get('.no-todo')
            .should('be.visible', true);
    });
});