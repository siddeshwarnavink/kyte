import Feature from './Feature';
import { Observable_Events } from '../../Observable';

import { generateId } from '../../../shared/utility';

class Directives extends Feature {
    run() {
        this.forEachAttrs(currentAttribute => {
            if (currentAttribute.name.charAt(0) === ':') {
                const actualName = currentAttribute.name.substring(1, currentAttribute.name.length);
                this.childEl.removeAttribute(currentAttribute.name);

                if (actualName === 'if') {
                    const childElCopy = this.childEl;
                    const replaceDummyId = generateId(16);

                    const innerStringInterpolation = this.childEl.querySelector('kyte-container[for="si"]');

                    const execureDirective = function () {
                        let isTrue;
                        eval(`isTrue = (${currentAttribute.value.replace('this.', 'this.widgetInst.')}) ? true: false`);

                        if (!isTrue) {
                            const replaceDummy = document.createElement('kyte-placeholder');
                            replaceDummy.setAttribute('id', replaceDummyId);
                            this.childEl.replaceWith(replaceDummy);
                        } else {
                            if (document.querySelector(`kyte-placeholder[id="${replaceDummyId}"]`)) {
                                document.querySelector(`kyte-placeholder[id="${replaceDummyId}"]`).replaceWith(childElCopy);
                                if (innerStringInterpolation) {
                                    const innerStringInterpolationData = this.widgetInst._stringInterpolations.find(strIntr => strIntr.id === innerStringInterpolation.id);
                                    innerStringInterpolationData.update();
                                }
                            }
                        }
                    };

                    execureDirective();

                    // Subscribe for the state changes
                    this.widgetInst.$state.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });

                    // Subscribe for the attribute changes
                    this.widgetInst.$attrs.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });
                }

                else if (actualName === 'hide') {
                    const defaultDisplayType = this.childEl.style.display;

                    const execureDirective = function () {
                        let isTrue;
                        eval(`isTrue = (${currentAttribute.value.replace('this.', 'this.widgetInst.')}) ? true: false`);

                        if (!isTrue) {
                            this.childEl.style.display = 'none';
                        } else {
                            this.childEl.style.display = defaultDisplayType;
                        }
                    };

                    execureDirective();

                    // Subscribe for the state changes
                    this.widgetInst.$state.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });

                    // Subscribe for the attribute changes
                    this.widgetInst.$attrs.subscribe(Observable_Events.changed, () => {
                        execureDirective();
                    });
                }
            }
        });
    }
}

export default Directives;