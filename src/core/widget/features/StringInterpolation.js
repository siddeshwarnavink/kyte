import Feature from './Feature';
import { Observable_Events } from '../../Observable';

import { createExtractor, generateId } from '../../../shared/utility';

class StringInterpolation extends Feature {
    forEachInterpolation(callback) {
        const stringInterpolationExtractor = createExtractor(['{{', '}}']);
        const extracts = stringInterpolationExtractor(this.widgetInst.template);

        extracts.forEach(callback);
    }

    generateCodeToRun(extract) {
        return extract
            .substring(2, extract.length - 2)
            .replace('this.', 'classInst.widgetInst.')
            .trim();
    }

    createKyteContaner(extract, codeToRun) {
        const classInst = this;

        const wrapperId = 'si_' + generateId(16);
        const wrapper = `<kyte-container for="si" id="${wrapperId}">${eval(codeToRun)}</kyte-container>`;

        classInst.childEl.innerHTML = this.childEl.innerHTML.replace(extract, wrapper);
        return wrapperId;
    }

    createSubscribeForUpdateFunction(wrapperId, codeToRun) {
        const classInst = this;

        return () => {
            if (document.querySelector(`kyte-container[id="${wrapperId}"]`)) {
                document.querySelector(`kyte-container[id="${wrapperId}"]`).innerHTML = eval(codeToRun);
            }
        }
    }

    subscribeForUpdates(codeToRun, wrapperId) {
        const classInst = this;
        const widgetInst = this.widgetInst;

        const update = classInst.createSubscribeForUpdateFunction(wrapperId, codeToRun);

        widgetInst._stringInterpolations.push({
            id: wrapperId,
            update
        });

        // Subscribe for the state changes
        widgetInst.$state.subscribe(Observable_Events.changed, update);

        // Subscribe for the attribute changes
        widgetInst.$attrs.subscribe(Observable_Events.changed, update);
    }

    run() {
        const classInst = this;

        this.forEachInterpolation((extract) => {
            const codeToRun = classInst.generateCodeToRun(extract);

            const wrapperId = classInst.createKyteContaner(extract, codeToRun);

            classInst.subscribeForUpdates(codeToRun, wrapperId);
        });
    }
}

export default StringInterpolation;