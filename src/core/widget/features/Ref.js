import Feature from './Feature';

class Ref extends Feature {
    isRef(currentAttribute) {
        return currentAttribute.name === 'ref';
    }

    isCustomWidget() {
        return Object.keys(this.widgetInst.widgets).indexOf(this.childEl.localName) > -1;
    }

    handleIfNativeElement(currentAttribute) {
        this.widgetInst.refs[currentAttribute.value] = {
            dom: this.childEl,
            isCustomWidget: false
        };
    }

    handleIfCustomWidget(currentAttribute) {
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

    run() {
        const classInst = this;

        this.forEachAttrs(currentAttribute => {
            if (classInst.isRef(currentAttribute)) {
                if (!classInst.isCustomWidget()) {
                    classInst.handleIfNativeElement(currentAttribute);
                } else {
                    classInst.handleIfCustomWidget(currentAttribute);
                }
            }
        });
    }
}

export default Ref;