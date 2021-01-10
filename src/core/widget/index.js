import CoreWidget from './CoreWidget';

import StringInterpolation from './features/StringInterpolation';
import EventListener from './features/EventListener';

class Widget extends CoreWidget {
    constructor(...args) {
        super(...args);

        this.preCustomWidgetFeatures = [
            StringInterpolation,
            EventListener
        ];
    }
}

export default Widget;