import Feature from './Feature';
import { Observable_Events } from '../../Observable';

import { createExtractor, generateId } from '../../../shared/utility';

class StringInterpolation extends Feature {
    run() {
        const widgetInst = this.widgetInst;

        // Creating an extractor
        const stringInterpolationExtractor = createExtractor(['{{', '}}']);
        // The extracted values
        const extracts = stringInterpolationExtractor(widgetInst.template);

        // If there are any extracts
        if (extracts.length > 0) {
            // Looping through the collected extracts
            extracts.forEach(extract => {
                // The code to eval() to get the actual value
                const codeToRun = extract
                    .substring(2, extract.length - 2)
                    .replace('this.', 'widgetInst.')
                    .trim();

                const wrapperId = 'si_' + generateId(16);
                this.childEl.innerHTML = this.childEl.innerHTML.replace(
                    extract,
                    `<kyte-container for="si" id="${wrapperId}">${eval(codeToRun)}</kyte-container>`
                );


                // Replace with new value
                function update() {
                    if (document.querySelector(`kyte-container[id="${wrapperId}"]`)) {
                        document.querySelector(`kyte-container[id="${wrapperId}"]`).innerHTML = eval(codeToRun);
                    }
                }

                widgetInst._stringInterpolations.push({
                    id: wrapperId,
                    update
                });

                // Subscribe for the state changes
                widgetInst.$state.subscribe(Observable_Events.changed, update);

                // Subscribe for the attribute changes
                widgetInst.$attrs.subscribe(Observable_Events.changed, update);
            });
        }
    }
}

export default StringInterpolation;