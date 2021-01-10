import Observable, { Observable_Events } from '../Observable';

function loadFeatures(widget, featureList) {
    featureList.forEach(featureModule => {
        const instance = new featureModule(widget);
        instance.run();
    });
}

class CoreWidget {
    constructor() {
        // Value defined in the inheriting class
        this.template = '';
        this.state = {};
        this.attrs = {};
        this.widgets = {};
        this.refs = {};

        // Features
        this.preCustomWidgetFeatures = [];
        this.postCustomWidgetFeatures = [];

        // Internal Observables
        this.$state;
        this.$attrs;

        // Internal values
        this._eventListeners = [];
        this._customWidgets = [];
        this._stringInterpolations = [];
        this._renderingLists = [];
    }

    // Lifecycle
    mounted() { }
    onAttrsChange() { }
    onStateChange() { }

    updateState(callback) {
        const oldState = { ...this.state };

        callback();

        this.$state.mutate(this.state);
        this.onStateChange(oldState);
    }

    _initializePreCustomWidgetsReactivity() {
        loadFeatures(this, this.preCustomWidgetFeatures);
    }

    _initializePostCustomWidgetsReactivity() {
        loadFeatures(this, this.preCustomWidgetFeatures);
    }

    mount(root, wrapperId = null) {
        this._root = root;
        this._wrapperId = wrapperId;
        this.widgets = {
            ...this.widgets,
        };

        // Creating state observable
        this.$state = new Observable(this.state);
        this.$state.subscribe(Observable_Events.changed, newValue => {
            const oldValue = { ...this.state };
            this.state = newValue;
            this.onStateChange(oldValue, newValue);
        });

        // Creating attribute observable
        this.$attrs = new Observable({
            ...this.defaultAttrs,
            ...this.attrs,
        });
        this.$attrs.subscribe(Observable_Events.changed, newValue => {
            const oldValue = { ...this.props };
            this.attrs = newValue;
            this.onAttrsChange(oldValue, newValue);
        });

        // Initial render
        this._root.innerHTML = this.template;

        // Initialize reactivity
        this._initializePreCustomWidgetsReactivity();

        // Mount custom widgets
        this._mountCustomWidgets();

        // Initialize reactivity
        this._initializePostCustomWidgetsReactivity();

        // Running the life cycle 'mounted'
        this.mounted();
    }

    unmount() {
        // Stop observing state and attrs
        this.$state.closeChannel();
        this.$attrs.closeChannel();

        // Unregister all event listeners
        this._eventListeners.forEach(listner => {
            listner.element.removeEventListener(listner.type, listner.onEmit);
        });

        this._root.innerHTML = '';
    }
}

export default CoreWidget;