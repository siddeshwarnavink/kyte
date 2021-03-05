class FetchDataItem extends Kyte.Widget {
    template = `
        <div>
            <b>{{ this.attrs.loopItem.key }}: </b>{{ this.attrs.loopItem.value }}
        </div>
    `;
}

class MyApp extends Kyte.Widget {
    widgets = {
        'fetch-data-item': FetchDataItem
    }

    state = {
        loading: false,
        data: []
    }

    template = `
        <fieldset style="width: 350px; margin: 1rem 0;">
            <b :if="!this.state.loading && this.state.data.length === 0">No data :-(</b>
            <b :if="this.state.loading">Please wait...</b>
            <fetch-data-item loopArray="this.state.data">
            </fetch-data-item>       
        </fieldset>
        <button #click={this.loadDataHandler}>Load data</button>
    `;

    loadDataHandler() {
        this.updateState(() => {
            this.state.loading = true;
        });

        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(response => response.json())
            .then(data => {
                const updatedData = [];

                Object.keys(data).forEach(key => {
                    updatedData.push({
                        key,
                        value: data[key]
                    });
                })

                this.updateState(() => {
                    this.state.loading = false;
                    this.state.data = [...updatedData];
                });
                console.log(data);
            });
    }
}

new Kyte({
    mount: new MyApp(),
    root: '#app'
});