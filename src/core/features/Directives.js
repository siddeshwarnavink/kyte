import Feature from '../Feature';
import { Observable_Events } from '../Observable';

import { generateId } from '../../shared/utility';

class Directives extends Feature {
    isDirective(currentAttribute) {
        return currentAttribute.name.charAt(0) === ':';
    }

    extractAttributeName(currentAttribute) {
        return currentAttribute.name.substring(1, currentAttribute.name.length);
    }

    // istanbul ignore next
    run() {
        const { widgetInst, childEl } = this;
        const classInst = this;

        this.forEachAttrs(currentAttribute => {
            if (classInst.isDirective(currentAttribute)) {
                const actualName = classInst.extractAttributeName(currentAttribute);
                childEl.removeAttribute(currentAttribute.name);

                if (actualName === 'if') {
                    const childElCopy = childEl;
                    const replaceDummyId = generateId(16);

                    const innerStringInterpolation = childEl.querySelector('kyte-container[for="si"]');

                    const execureDirective = function () {
                        let isTrue;
                        eval(`isTrue = (${currentAttribute.value.replace('this.', 'widgetInst.')}) ? true: false`);

                        if (!isTrue) {
                            const replaceDummy = document.createElement('kyte-placeholder');
                            replaceDummy.setAttribute('id', replaceDummyId);
                            childEl.replaceWith(replaceDummy);
                        } else {
                            if (document.querySelector(`kyte-placeholder[id="${replaceDummyId}"]`)) {
                                document.querySelector(`kyte-placeholder[id="${replaceDummyId}"]`).replaceWith(childElCopy);
                                if (innerStringInterpolation) {
                                    const innerStringInterpolationData = widgetInst._stringInterpolations.find(strIntr => strIntr.id === innerStringInterpolation.id);
                                    innerStringInterpolationData.update();
                                }
                            }
                        }
                    };

                    execureDirective();

                    // Subscribe for the state changes
                    widgetInst.$state.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });

                    // Subscribe for the attribute changes
                    widgetInst.$attrs.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });
                }

                else if (actualName === 'hide') {
                    const defaultDisplayType = childEl.style.display;

                    const execureDirective = function () {
                        let isTrue;
                        eval(`isTrue = (${currentAttribute.value.replace('this.', 'widgetInst.')}) ? true: false`);

                        if (!isTrue) {
                            childEl.style.display = 'none';
                        } else {
                            childEl.style.display = defaultDisplayType;
                        }
                    };

                    execureDirective();

                    // Subscribe for the state changes
                    widgetInst.$state.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });

                    // Subscribe for the attribute changes
                    widgetInst.$attrs.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });
                }
            }
        });
    }
}

export default Directives;