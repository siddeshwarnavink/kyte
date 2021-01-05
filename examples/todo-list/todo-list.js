class TodoListItem extends Kyte.Widget {
    template = `
        <li class="todo-list-item">
            {{ this.attrs.loopItem }}
            <button #click={this.onRemoveTodo} class="remove">x</button>
        </li>
    `;

    onRemoveTodo() {
        this.attrs.deletetodo(this.attrs.loopIndex);
    }
}

class TodoList extends Kyte.Widget {
    widgets = {
        'todo-list-item': TodoListItem
    }

    template = `
        <ul class="todo-list">
            <todo-list-item 
                loopArray="this.attrs.todos"
                [deleteTodo]="this.onDeleteTodo"
            >
            </todo-list-item>
        </ul>
    `;

    onDeleteTodo = (todoId) => {
        this.attrs.deletetodo(todoId);
    }
}

class MyApp extends Kyte.Widget {
    widgets = {
        'todo-list': TodoList
    }

    state = {
        todos: [
            'Drink Milk',
            'Watch a movie',
            'Have fun!'
        ],
    }

    template = `
        <main class="container">
            <h1 class="container__title">My Todo</h1>

            <todo-list 
                [todos]="this.state.todos"
                [deleteTodo]="this.handleDeleteTodo"
            >
            </todo-list>

            <section class="no-todo" :if="this.state.todos.length === 0">
                <img alt="no todo" src="./images/no-todo.jpg" />
                <h1>Nothing to do!</h1>
            </section>

            <form class="add-todo" #submit={this.handleSubmit}>
                <input ref="newTodoInput" placeholder="e.g Learn Kyte.js" />
                <button type="submit">+</button>
            </form>
        </main>
    `;

    handleSubmit(event) {
        event.preventDefault();

        if (this.refs.newTodoInput.dom.value.trim() !== '') {
            console.log(`New todo: ${this.refs.newTodoInput.dom.value}`);

            this.updateState(() => {
                this.state.todos.push(this.refs.newTodoInput.dom.value);
                this.refs.newTodoInput.dom.value = '';
            });
        }
    }

    handleDeleteTodo = (todoId) => {
        const updatedTodos = [...this.state.todos];

        updatedTodos.splice(todoId, 1);

        this.updateState(() => {
            console.log(`Deleting todo:  ${this.state.todos[todoId]}`);
            this.state.todos = updatedTodos;
        });
    }
}

new Kyte({
    mount: new MyApp(),
    root: '#app'
});