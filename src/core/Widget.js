import Observable, { Observable_Events } from './Observable';

import { generateId, createExtractor, htmlContains, arrayDifference } from '../shared/utility';

class Widget {
    // Value defined in the inheriting class
    template = '';
    state = {};
    attrs = {};
    widgets = {};
    refs = {};

    // Internal Observables
    $state;
    $attrs;

    // Internal values
    _eventListeners = [];
    _customWidgets = [];
    _stringInterpolations = [];
    _renderingLists = [];

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
        // Instance of the widget class
        const classInst = this;

        // Runs for every DOM elements
        function onLoop(domEl) {
            for (let i = 0; i < domEl.children.length; i++) {
                const childEl = domEl.children[i];
                const childElAttributes = { ...childEl.attributes };

                // Handling string interpolation
                (function () {
                    // Creating an extractor
                    const stringInterpolationExtractor = createExtractor(['{{', '}}']);
                    // The extracted values
                    const extracts = stringInterpolationExtractor(classInst.template);

                    // If there are any extracts
                    if (extracts.length > 0) {
                        // Looping through the collected extracts
                        extracts.forEach(extract => {
                            // The code to eval() to get the actual value
                            const codeToRun = extract
                                .substring(2, extract.length - 2)
                                .replace('this.', 'classInst.')
                                .trim();

                            const wrapperId = 'si_' + generateId(16);
                            childEl.innerHTML = childEl.innerHTML.replace(
                                extract,
                                `<kyte-container for="si" id="${wrapperId}">${eval(codeToRun)}</kyte-container>`
                            );


                            // Replace with new value
                            function update() {
                                if (document.querySelector(`kyte-container[id="${wrapperId}"]`)) {
                                    document.querySelector(`kyte-container[id="${wrapperId}"]`).innerHTML = eval(codeToRun);
                                }
                            }

                            classInst._stringInterpolations.push({
                                id: wrapperId,
                                update
                            });

                            // Subscribe for the state changes
                            classInst.$state.subscribe(Observable_Events.changed, update);

                            // Subscribe for the attribute changes
                            classInst.$attrs.subscribe(Observable_Events.changed, update);
                        });
                    }
                })();

                // For each attribute of child
                Object.keys(childElAttributes).forEach(attrKey => {
                    const currentAttribute = childElAttributes[attrKey];

                    // Event listners
                    if (currentAttribute.name.charAt(0) === '#') {
                        const eventName = currentAttribute.name.substring(1);

                        // Check if the event is already registered
                        if (!classInst._eventListeners.find(event => (event.type === eventName && event.element.innerHTML.trim() === childEl.innerHTML.trim()))) {
                            // Utility function for registering an event.
                            function addEvent(eventName, eventHandler, childEl) {
                                childEl.addEventListener(eventName, eventHandler);

                                classInst._eventListeners = [
                                    ...classInst._eventListeners,
                                    {
                                        type: eventName,
                                        onEmit: eventHandler,
                                        element: childEl
                                    }
                                ]
                            }

                            // if the attribute is for 'Two-way binding'
                            if (eventName === 'bind') {
                                // Making sure that the parrent widget is not handling
                                if (htmlContains(classInst.template, childEl.outerHTML)) {
                                    // The state to which the input must be binded with
                                    const statePieceName = currentAttribute.value.substring(1, currentAttribute.value.length - 1).replace('this.', 'classInst.');

                                    // Setting the default value of the input
                                    childEl.value = eval(statePieceName);

                                    // Binding logic
                                    addEvent('input', (event) => {
                                        eval(`
                                         classInst.updateState(() => {
                                             ${statePieceName} = event.target.value;
                                         })
                                     `);

                                        childEl.value = event.target.value;
                                    }, childEl);
                                }

                            }
                            // Default event listener
                            else {
                                const eventHandler = (event) => {
                                    const codeToRun = `${currentAttribute.value.substring(1, currentAttribute.value.length - 1).replace('this.', 'classInst.')}(event)`;
                                    eval(codeToRun);
                                };
                                addEvent(eventName, eventHandler, childEl);
                            }
                        }
                    }
                });

                // if the children has it's own children
                if (childEl.children.length > 0) {
                    onLoop(childEl);
                }
            }
        }

        onLoop(this._root);
    }

    _initializePostCustomWidgetsReactivity() {
        // Instance of the widget class
        const classInst = this;

        // Runs for every DOM elements
        function onLoop(domEl) {
            for (let i = 0; i < domEl.children.length; i++) {
                const childEl = domEl.children[i];
                const childElAttributes = { ...childEl.attributes };


                // For each attribute of child
                Object.keys(childElAttributes).forEach(attrKey => {
                    const currentAttribute = childElAttributes[attrKey];

                    // if the attribute is for 'loopArray'
                    if (currentAttribute.name === 'looparray') {
                        Promise.resolve().then(() => {
                            // Check if it is a custom widget
                            const isCustomWidget = Object.keys(classInst.widgets).indexOf(childEl.localName) > -1;
                            let defaultAttrs;

                            let actualArray;
                            eval(`actualArray = ${currentAttribute.value.replace('this.', 'classInst.')}`);

                            if (isCustomWidget) {
                                const listId = generateId(16);
                                const renderingListValue = {
                                    currentArray: [...actualArray],
                                    widgetRef: []
                                };

                                classInst._customWidgets.forEach(cWidget => {
                                    // Finding the selected widget instance
                                    if (childEl.children[0].attributes.id.value === cWidget.id) {
                                        const widget = cWidget.instance;
                                        const listWrapper = cWidget.widgetWrapper.parentElement;

                                        defaultAttrs = { ...widget.attrs };

                                        renderingListValue.listWrapper = listWrapper;
                                        renderingListValue.listItemObject = cWidget.object;

                                        actualArray.forEach((arrayEl, index) => {
                                            if (index < 1) {
                                                widget.$attrs.mutate({
                                                    ...widget.attrs,
                                                    loopItem: arrayEl,
                                                    loopIndex: index
                                                });

                                                renderingListValue.widgetRef.push(widget);
                                            } else {
                                                const newListItemWidget = new cWidget.object();
                                                newListItemWidget.attrs = {
                                                    ...defaultAttrs,
                                                    loopItem: arrayEl,
                                                    loopIndex: index
                                                }

                                                const wrapper = document.createElement('kyte-container');
                                                wrapper.setAttribute('id', 'cw_' + generateId(16));

                                                newListItemWidget.mount(wrapper);
                                                listWrapper.appendChild(wrapper);

                                                renderingListValue.widgetRef.push(newListItemWidget);
                                            }
                                        });
                                    }
                                });

                                classInst._renderingLists[listId] = renderingListValue;

                                function updateListItem() {
                                    const currentRenderingListData = { ...classInst._renderingLists[listId] };

                                    let newArray;
                                    eval(`newArray = [...${currentAttribute.value.replace('this.', 'classInst.')}]`);

                                    if (JSON.stringify(newArray) === JSON.stringify(currentRenderingListData.currentArray)) {
                                        return;
                                    }

                                    // Element added (or) removed
                                    if (currentRenderingListData.currentArray.length !== newArray.length) {
                                        const differenceArray = arrayDifference(currentRenderingListData.currentArray, newArray);

                                        // new element(s) is/are added.
                                        if (newArray.length > currentRenderingListData.currentArray.length) {
                                            differenceArray.forEach(newArrayEl => {
                                                const index = newArray.indexOf(newArrayEl);
                                                const previousListItem = currentRenderingListData.listWrapper.children[index];

                                                currentRenderingListData.currentArray[index] = newArrayEl;

                                                const newListItemWidget = new currentRenderingListData.listItemObject();
                                                newListItemWidget.attrs = {
                                                    ...defaultAttrs,
                                                    loopItem: newArrayEl,
                                                    loopIndex: index
                                                }

                                                const wrapper = document.createElement('kyte-container');
                                                wrapper.setAttribute('id', 'cw_' + generateId(16));

                                                newListItemWidget.mount(wrapper);
                                                currentRenderingListData.widgetRef[index] = newListItemWidget;
                                                currentRenderingListData.listWrapper.insertBefore(wrapper, previousListItem);
                                            });
                                        }
                                        // element(s) is/are deleted.
                                        else {
                                            differenceArray.forEach(newArrayEl => {
                                                const index = currentRenderingListData.currentArray.indexOf(newArrayEl);
                                                const listItemWidget = currentRenderingListData.widgetRef[index];

                                                listItemWidget.unmount();
                                                currentRenderingListData.widgetRef.splice(index, 1);
                                            });
                                        }

                                        currentRenderingListData.widgetRef.forEach((listItemWidget, index) => {
                                            listItemWidget.attrs.loopIndex = index;
                                        });
                                    }
                                    // Update existing items
                                    else {
                                        newArray.forEach((arrayEl, index) => {
                                            if (JSON.stringify(currentRenderingListData.currentArray[index]) !== JSON.stringify(arrayEl)) {
                                                if (currentRenderingListData.widgetRef.indexOf(index) > -1) {
                                                    currentRenderingListData.widgetRef[index].$attrs.mutate({
                                                        ...currentRenderingListData.widgetRef[index].attrs,
                                                        loopItem: arrayEl
                                                    });
                                                }
                                            }
                                        });

                                    }
                                    currentRenderingListData.currentArray = [...newArray];

                                    classInst._renderingLists[listId] = { ...currentRenderingListData };
                                }

                                // Subscribing to state change
                                classInst.$state.subscribe(Observable_Events.changed, updateListItem);

                                // Subscribing to attrs change
                                classInst.$attrs.subscribe(Observable_Events.changed, updateListItem);
                            }
                        });
                    }

                    // if the attribute is for 'ref'
                    if (currentAttribute.name === 'ref') {
                        // Check if it is a custom widget
                        const isCustomWidget = Object.keys(classInst.widgets).indexOf(childEl.localName) > -1;

                        if (!isCustomWidget) {
                            classInst.refs[currentAttribute.value] = {
                                dom: childEl,
                                isCustomWidget: false
                            }
                        } else {
                            // Looping throught all the registered widgets
                            classInst._customWidgets.forEach(cWidget => {
                                // Finding the selected widget instance
                                if (childEl.children[0].attributes.id.value === cWidget.id) {
                                    const widget = cWidget.instance;

                                    classInst.refs[currentAttribute.value] = {
                                        dom: childEl,
                                        isCustomWidget: true,
                                        widget
                                    }
                                }
                            });
                        }
                    }

                    // if the attribute is for 'Dynamic attributes'
                    else if (currentAttribute.name.charAt(0) === '[' && currentAttribute.name.charAt(currentAttribute.name.length - 1)) {
                        // Actual argument name
                        const actualName = currentAttribute.name.substring(1, currentAttribute.name.length - 1);
                        // The code to evan() and get the value
                        const codeForActualValue = currentAttribute.value.replace('this.', 'classInst.');
                        const actualValue = eval(codeForActualValue);

                        // Check if it is a custom widget
                        const isCustomWidget = Object.keys(classInst.widgets).indexOf(childEl.localName) > -1;
                        if (isCustomWidget) {
                            // Looping throught all the registered widgets
                            classInst._customWidgets.forEach(cWidget => {
                                // Finding the selected widget instance
                                if (childEl.children[0].attributes.id.value === cWidget.id) {
                                    const widget = cWidget.instance;

                                    // Setting the initial value
                                    const newAttr = {
                                        ...widget.$attrs.getVal(),
                                    };

                                    newAttr[actualName] = actualValue;
                                    widget.$attrs.mutate(newAttr);
                                    widget.attrs = newAttr;


                                    function updateWidgetAttr() {
                                        const newCode = eval(`${codeForActualValue}`.replace('classInst.attrs', 'newAttrs'));

                                        // Updating the widget's attr
                                        const oldAttr = { ...widget.attrs }
                                        const newAttr = { ...oldAttr };
                                        newAttr[actualName] = newCode;

                                        widget.$attrs.mutate(newAttr);
                                    }

                                    // Subscribing to state change
                                    classInst.$state.subscribe(Observable_Events.changed, updateWidgetAttr);

                                    // Subscribing to attrs change
                                    classInst.$attrs.subscribe(Observable_Events.changed, updateWidgetAttr);
                                }
                            });
                        }
                        // It is a native HTML element.
                        else {
                            if (actualValue) {
                                childEl.setAttribute(actualName, actualValue);
                                childEl.removeAttribute(currentAttribute.name);
                            }
                        }
                    }

                    // Directives
                    else if (currentAttribute.name.charAt(0) === ':') {
                        const actualName = currentAttribute.name.substring(1, currentAttribute.name.length);
                        childEl.removeAttribute(currentAttribute.name);

                        if (actualName === 'if') {
                            const childElCopy = childEl;
                            const replaceDummyId = generateId(16);

                            const innerStringInterpolation = childEl.querySelector('kyte-container[for="si"]');

                            function execureDirective() {
                                let isTrue;
                                eval(`isTrue = (${currentAttribute.value.replace('this.', 'classInst.')}) ? true: false`);

                                if (!isTrue) {
                                    const replaceDummy = document.createElement('kyte-placeholder')
                                    replaceDummy.setAttribute('id', replaceDummyId)
                                    childEl.replaceWith(replaceDummy);
                                } else {
                                    if (document.querySelector(`kyte-placeholder[id="${replaceDummyId}"]`)) {
                                        document.querySelector(`kyte-placeholder[id="${replaceDummyId}"]`).replaceWith(childElCopy);
                                        if (innerStringInterpolation) {
                                            const innerStringInterpolationData = classInst._stringInterpolations.find(strIntr => strIntr.id === innerStringInterpolation.id);
                                            innerStringInterpolationData.update();
                                        }
                                    }
                                }
                            }

                            execureDirective();

                            // Subscribe for the state changes
                            classInst.$state.subscribe(Observable_Events.changed, () => {
                                execureDirective();
                            });

                            // Subscribe for the attribute changes
                            classInst.$attrs.subscribe(Observable_Events.changed, () => {
                                execureDirective();
                            });
                        }

                        else if (actualName === 'hide') {
                            const defaultDisplayType = childEl.style.display

                            function execureDirective() {
                                let isTrue;
                                eval(`isTrue = (${currentAttribute.value.replace('this.', 'classInst.')}) ? true: false`);

                                if (!isTrue) {
                                    childEl.style.display = 'none';
                                } else {
                                    childEl.style.display = defaultDisplayType;
                                }
                            }

                            execureDirective();

                            // Subscribe for the state changes
                            classInst.$state.subscribe(Observable_Events.changed, () => {
                                execureDirective();
                            });

                            // Subscribe for the attribute changes
                            classInst.$attrs.subscribe(Observable_Events.changed, () => {
                                execureDirective();
                            });
                        }
                    }
                });

                // if the children has it's own children
                if (childEl.children.length > 0) {
                    onLoop(childEl);
                }
            }
        }
        onLoop(this._root);
    }

    _mountCustomWidgets() {
        // Instance of the widget class
        const classInst = this;

        // Check if the widget has any custom widget
        if (Object.keys(classInst.widgets).length > 0) {
            // Looping throught the custom widgets registered in the widget
            Object.keys(classInst.widgets).forEach(widgetName => {
                if (!!!customElements.get(widgetName)) {
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

                                kyteChildren.replaceWith(childContainer)
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
            const oldValue = this.state;
            this.state = newValue;
            this.onStateChange(oldValue, newValue);
        });

        // Creating attribute observable
        this.$attrs = new Observable({
            ...this.defaultAttrs,
            ...this.attrs,
        });
        this.$attrs.subscribe(Observable_Events.changed, newValue => {
            const oldValue = this.props;
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

export default Widget;