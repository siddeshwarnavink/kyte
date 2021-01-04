class PageTitle extends Kyte.Widget {
    template = `
        <h1>{{ this.attrs.title }}</h1>
    `;
}

class PageCounter extends Kyte.Widget {
    state = {
        pageSpentSeconds: 0
    };

    template = `
        <p>The time is {{ this.state.pageSpentSeconds }}</p>
    `;

    mounted() {
        setInterval(() => {
            this.updateState(() => {
                this.state.pageSpentSeconds += 1;
            });
        }, 1000);
    }
}


class MyApp extends Kyte.Widget {
    widgets = {
        'page-title': PageTitle,
        'page-counter': PageCounter,
    };

    state = {
        pageTitle: 'Hello world!',
    };

    template = `
        <page-title [title]="this.state.pageTitle"></page-title>
        <page-counter></page-counter>
        
        <button #click={this.changeTitleHandler}>Change title</button>
    `;

    changeTitleHandler() {
        console.log('Changing title...');
        this.updateState(() => {
            this.state.pageTitle = 'Title changed!';
        });
    }
}

new Kyte({
    mount: new MyApp(),
    root: '#app'
});