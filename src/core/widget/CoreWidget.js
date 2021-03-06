import Observable, { Observable_Events } from '../Observable';

import { generateId } from '../../shared/utility';

function loadFeatures(widget, DOMRoot, featureList) {
    function onLoop(domEl) {
        for (let i = 0; i < domEl.children.length; i++) {
            const childEl = domEl.children[i];
            const childElAttributes = { ...childEl.attributes };

            featureList.forEach(featureModule => {
                const instance = new featureModule(widget, childEl, childElAttributes);
                instance.run();
            });

            if (childEl.children.length > 0) {
                onLoop(childEl);
            }
        }
    }

    onLoop(DOMRoot);
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
        loadFeatures(this, this._root, this.preCustomWidgetFeatures);
    }

    _initializePostCustomWidgetsReactivity() {
        loadFeatures(this, this._root, this.postCustomWidgetFeatures);
    }

    _mountCustomWidgets() {
        // Instance of the widget class
        const classInst = this;

        // Check if the widget has any custom widget
        if (Object.keys(classInst.widgets).length > 0) {
            // Looping throught the custom widgets registered in the widget
            Object.keys(classInst.widgets).forEach(widgetName => {
                if (!customElements.get(widgetName)) {
                    // Definging the 'Web component' which mounts the custom widget
                    customElements.define(widgetName, class extends HTMLElement {
                        constructor() {
                            super();

                            // Creating the kyte-container for easy mounting.
                            const wrapper = document.createElement('kyte-container');
                            const wrapperId = 'cw_' + generateId(16);
                            const innetChild = this.innerHTML.trim();
                            this.innerHTML = '';
                            wrapper.setAttribute('id', wrapperId);
                            this.appendChild(wrapper);

                            // Getting the attributes of the Web component
                            const widgetAttributes = {};
                            for (let i = 0; i < this.attributes.length; i++) {
                                const attribute = this.attributes[i];
                                widgetAttributes[attribute.name] = attribute.value;
                            }

                            // Creating the actual widget
                            const Widget = new classInst.widgets[widgetName]();
                            this.widget = Widget;

                            // Mounting the widget with its attributes
                            Widget.$attrs = new Observable(widgetAttributes);
                            Widget.attrs = { ...widgetAttributes };
                            Widget.mount(wrapper, wrapperId);

                            // Handling <kyte-children />
                            const kyteChildren = wrapper.querySelector('kyte-children');
                            if (kyteChildren) {
                                const childContainer = document.createElement('kyte-container');
                                childContainer.innerHTML = innetChild;

                                kyteChildren.replaceWith(childContainer);
                            }

                            // Mounting the Web component to the DOM
                            this.children[0].replaceWith(wrapper);
                            classInst._customWidgets.push({
                                instance: Widget,
                                object: classInst.widgets[widgetName],
                                id: wrapperId,
                                widgetWrapper: wrapper
                            });
                        }
                    });
                }
            });
        }
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