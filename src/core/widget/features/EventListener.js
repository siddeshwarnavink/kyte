import Feature from './Feature';

import { htmlContains } from '../../../shared/utility';

class EventListener extends Feature {
    checkForEventListner(currentAttribute) {
        return currentAttribute.name.charAt(0) === '#';
    }

    getEventName(currentAttribute) {
        return currentAttribute.name.substring(1);
    }

    checkForEventAlreadyRegistered(eventName) {
        return this.widgetInst._eventListeners.find(event => (event.type === eventName && event.element.innerHTML.trim() === this.childEl.innerHTML.trim())) ? true : false;
    }

    bindEventGenerateStatePieceName(currentAttribute) {
        return currentAttribute.value.substring(1, currentAttribute.value.length - 1).replace('this.', 'this.widgetInst.');
    }

    createAddEventFunction() {
        return (eventName, eventHandler, childEl) => {
            childEl.addEventListener(eventName, eventHandler);

            this.widgetInst._eventListeners = [
                ...this.widgetInst._eventListeners,
                {
                    type: eventName,
                    onEmit: eventHandler,
                    element: childEl
                }
            ];
        };
    }

    createOtherEventHandlerFunction(currentAttribute) {
        return (event) => {
            const codeToRun = `${currentAttribute.value.substring(1, currentAttribute.value.length - 1).replace('this.', 'widgetInst.')}(event)`;
            eval(codeToRun);
        };
    }

    // if the attribute is for 'Two-way binding'
    bindEventHandler(addEvent, currentAttribute) {
        if (htmlContains(this.widgetInst.template, this.childEl.outerHTML)) {
            const statePieceName = this.bindEventGenerateStatePieceName(currentAttribute);

            this.childEl.value = eval(statePieceName);

            // istanbul ignore next
            addEvent('input', (event) => {
                eval(`
                 this.widgetInst.updateState(() => {
                     ${statePieceName} = event.target.value;
                 })
             `);

                this.childEl.value = event.target.value;
            }, this.childEl);
        } else {
            return false;
        }
    }

    otherEventHandler(currentAttribute, eventName, addEvent) {
        const eventHandler = this.createOtherEventHandlerFunction(currentAttribute);
        addEvent(eventName, eventHandler, this.childEl);
    }

    run() {
        const classInst = this;

        classInst.forEachAttrs(currentAttribute => {
            // istanbul ignore next
            if (!classInst.checkForEventListner(currentAttribute)) {
                const eventName = classInst.getEventName(currentAttribute);

                if (classInst.checkForEventAlreadyRegistered(eventName)) {
                    const addEvent = this.createAddEventFunction();

                    if (eventName === 'bind') {
                        classInst.bindEventHandler(addEvent, currentAttribute);
                    } else {
                        classInst.otherEventHandler(currentAttribute, eventName, addEvent);
                    }
                }
            }
        });
    }
}

export default EventListener;