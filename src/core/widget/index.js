import CoreWidget from './CoreWidget';

import StringInterpolation from '../features/StringInterpolation';
import EventListener from '../features/EventListener';
import LoopArray from '../features/LoopArray';
import Ref from '../features/Ref';
import DynamicAttributes from '../features/DynamicAttributes';
import Directives from '../features/Directives';

class Widget extends CoreWidget {
    constructor(...args) {
        super(...args);

        this.preCustomWidgetFeatures = [
            StringInterpolation,
            EventListener
        ];
        this.postCustomWidgetFeatures = [
            LoopArray,
            Ref,
            DynamicAttributes,
            Directives
        ];
    }
}

export default Widget;