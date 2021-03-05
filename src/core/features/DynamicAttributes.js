import Feature from '../Feature';
import { Observable_Events } from '../Observable';

class DynamicAttributes extends Feature {
    isDynamicAttribute(currentAttribute) {
        return currentAttribute.name.charAt(0) === '[' && currentAttribute.name.charAt(currentAttribute.name.length - 1) ? true : false;
    }

    extractActualAttributeName(currentAttribute) {
        return currentAttribute.name.substring(1, currentAttribute.name.length - 1);
    }

    generateCodeForActualValue(currentAttribute) {
        // eslint-disable-next-line no-unused-vars
        const classInst = this;

        return currentAttribute.value.replace(/this./g, 'classInst.widgetInst.');
    }

    isCustomWidget() {
        return Object.keys(this.widgetInst.widgets).indexOf(this.childEl.localName) > -1;
    }

    getCurrentWidgetInstance(callback) {
        this.widgetInst._customWidgets.forEach(cWidget => {
            if (this.childEl.children[0].attributes.id.value === cWidget.id) {
                const widget = cWidget.instance;
                callback(widget);
            }
        });
    }

    setInitialValue(widget, actualName, actualValue, newAttr) {
        newAttr[actualName] = actualValue;
        widget.$attrs.mutate(newAttr);
        widget.attrs = { ...newAttr };
    }

    // eslint-disable-next-line no-unused-vars
    generateUpdateWidgetAttrFunction(widget, actualName, codeForActualValue, _newAttr) {
        // eslint-disable-next-line no-unused-vars
        const classInst = this;

        return () => {
            const newCode = eval(`${codeForActualValue}`.replace('classInst.widgetInst.attrs', '_newAttr'));

            // Updating the widget's attr
            const oldAttr = { ...widget.attrs };
            const newAttr = { ...oldAttr };
            newAttr[actualName] = newCode;

            widget.$attrs.mutate(newAttr);
        };
    }

    listenForUpdateHandler(widget, actualName, codeForActualValue, newAttr) {
        const classInst = this;

        const updateWidgetAttr = classInst.generateUpdateWidgetAttrFunction(widget, actualName, codeForActualValue, newAttr);

        // Subscribing to state change
        this.widgetInst.$state.subscribe(Observable_Events.changed, updateWidgetAttr);

        // Subscribing to attrs change
        this.widgetInst.$attrs.subscribe(Observable_Events.changed, updateWidgetAttr);
    }

    handleNativeElementDynamicAttribute(actualName, actualValue, currentAttribute) {
        if (actualValue) {
            this.childEl.setAttribute(actualName, actualValue);
            this.childEl.removeAttribute(currentAttribute.name);
        }
    }

    run() {
        const classInst = this;

        this.forEachAttrs(currentAttribute => {
            if (classInst.isDynamicAttribute(currentAttribute)) {
                const actualName = classInst.extractActualAttributeName(currentAttribute);

                const codeForActualValue = classInst.generateCodeForActualValue(currentAttribute);
                const actualValue = eval(codeForActualValue);

                if (classInst.isCustomWidget()) {
                    classInst.getCurrentWidgetInstance(widget => {
                        const newAttr = { ...widget.$attrs.getVal() };

                        classInst.setInitialValue(widget, actualName, actualValue, newAttr);
                        classInst.listenForUpdateHandler(widget, actualName, codeForActualValue, newAttr);
                    });
                }
                else {
                    classInst.handleNativeElementDynamicAttribute(actualName, actualValue, currentAttribute);
                }
            }
        });
    }
}

export default DynamicAttributes;