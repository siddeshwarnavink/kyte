import Feature from './Feature';

import { htmlContains } from '../../../shared/utility';

class EventListener extends Feature {
    run() {
        const widgetInst = this.widgetInst;

        this.forEachAttrs(currentAttribute => {
            if (currentAttribute.name.charAt(0) === '#') {
                const eventName = currentAttribute.name.substring(1);

                // Check if the event is already registered
                if (!widgetInst._eventListeners.find(event => (event.type === eventName && event.element.innerHTML.trim() === this.childEl.innerHTML.trim()))) {
                    // Utility function for registering an event.
                    const addEvent = function (eventName, eventHandler, childEl) {
                        childEl.addEventListener(eventName, eventHandler);

                        widgetInst._eventListeners = [
                            ...widgetInst._eventListeners,
                            {
                                type: eventName,
                                onEmit: eventHandler,
                                element: childEl
                            }
                        ];
                    };

                    // if the attribute is for 'Two-way binding'
                    if (eventName === 'bind') {
                        // Making sure that the parrent widget is not handling
                        if (htmlContains(widgetInst.template, this.childEl.outerHTML)) {
                            // The state to which the input must be binded with
                            const statePieceName = currentAttribute.value.substring(1, currentAttribute.value.length - 1).replace('this.', 'widgetInst.');

                            // Setting the default value of the input
                            this.childEl.value = eval(statePieceName);

                            // Binding logic
                            addEvent('input', (event) => {
                                eval(`
                                 widgetInst.updateState(() => {
                                     ${statePieceName} = event.target.value;
                                 })
                             `);

                                this.childEl.value = event.target.value;
                            }, this.childEl);
                        }

                    }
                    // Default event listener
                    else {
                        const eventHandler = () => {
                            const codeToRun = `${currentAttribute.value.substring(1, currentAttribute.value.length - 1).replace('this.', 'widgetInst.')}(event)`;
                            eval(codeToRun);
                        };
                        addEvent(eventName, eventHandler, this.childEl);
                    }
                }
            }
        });
    }
}

export default EventListener;