import Feature from './Feature';
import { Observable_Events } from '../../Observable';

class DynamicAttributes extends Feature {
    run() {
        const widgetInst = this.widgetInst;

        this.forEachAttrs(currentAttribute => {
            if (currentAttribute.name.charAt(0) === '[' && currentAttribute.name.charAt(currentAttribute.name.length - 1)) {
                // Actual argument name
                const actualName = currentAttribute.name.substring(1, currentAttribute.name.length - 1);
                // The code to evan() and get the value
                const codeForActualValue = currentAttribute.value.replace('this.', 'widgetInst.');
                const actualValue = eval(codeForActualValue);

                // Check if it is a custom widget
                const isCustomWidget = Object.keys(widgetInst.widgets).indexOf(this.childEl.localName) > -1;
                if (isCustomWidget) {
                    // Looping throught all the registered widgets
                    widgetInst._customWidgets.forEach(cWidget => {
                        // Finding the selected widget instance
                        if (this.childEl.children[0].attributes.id.value === cWidget.id) {
                            const widget = cWidget.instance;

                            // Setting the initial value
                            const newAttr = {
                                ...widget.$attrs.getVal(),
                            };

                            newAttr[actualName] = actualValue;
                            widget.$attrs.mutate(newAttr);
                            widget.attrs = newAttr;


                            const updateWidgetAttr = function () {
                                const newCode = eval(`${codeForActualValue}`.replace('widgetInst.attrs', 'newAttrs'));

                                // Updating the widget's attr
                                const oldAttr = { ...widget.attrs };
                                const newAttr = { ...oldAttr };
                                newAttr[actualName] = newCode;

                                widget.$attrs.mutate(newAttr);
                            };

                            // Subscribing to state change
                            widgetInst.$state.subscribe(Observable_Events.changed, updateWidgetAttr);

                            // Subscribing to attrs change
                            widgetInst.$attrs.subscribe(Observable_Events.changed, updateWidgetAttr);
                        }
                    });
                }
                // It is a native HTML element.
                else {
                    if (actualValue) {
                        this.childEl.setAttribute(actualName, actualValue);
                        this.childEl.removeAttribute(currentAttribute.name);
                    }
                }
            }
        });
    }
}

export default DynamicAttributes;