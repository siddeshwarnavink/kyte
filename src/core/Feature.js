/* eslint-disable no-unused-vars */
class Feature {
    constructor(widgetInst, childEl, childElAttributes) {
        this.widgetInst = widgetInst;
        this.childEl = childEl;
        this.childElAttributes = childElAttributes;
    }

    run() {
        throw new Error('Feature should be used as parent class.');
    }

    forEachAttrs(callback) {
        Object.keys(this.childElAttributes).forEach(attrKey => {
            const currentAttribute = this.childElAttributes[attrKey];
            // callback(currentAttribute);
        });
    }
}

export default Feature;