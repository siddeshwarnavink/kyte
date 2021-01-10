import Feature from './Feature';

class Ref extends Feature {
    run() {
        this.forEachAttrs(currentAttribute => {
            if (currentAttribute.name === 'ref') {
                // Check if it is a custom widget
                const isCustomWidget = Object.keys(this.widgetInst.widgets).indexOf(this.childEl.localName) > -1;

                if (!isCustomWidget) {
                    this.widgetInst.refs[currentAttribute.value] = {
                        dom: this.childEl,
                        isCustomWidget: false
                    };
                } else {
                    // Looping throught all the registered widgets
                    this.widgetInst._customWidgets.forEach(cWidget => {
                        // Finding the selected widget instance
                        if (this.childEl.children[0].attributes.id.value === cWidget.id) {
                            const widget = cWidget.instance;

                            this.widgetInst.refs[currentAttribute.value] = {
                                dom: this.childEl,
                                isCustomWidget: true,
                                widget
                            };
                        }
                    });
                }
            }
        });
    }
}

export default Ref;