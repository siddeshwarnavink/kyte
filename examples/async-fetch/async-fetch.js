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
            <b :if="this.state.data.length === 0">No data :-(</b>
            <fetch-data-item loopArray="this.state.data">
            </fetch-data-item>       
        </fieldset>
        <button>Load data</button>
    `;

    mounted() {
        console.log('hello!');
    }
}

new Kyte({
    mount: new MyApp(),
    root: '#app'
});