import DynamicAttributes from '../../../../src/core/features/DynamicAttributes';
import Observable from '../../../../src/core/Observable';

test('isDynamicAttribute() should return true if it is a dynamic attribute', () => {
    const dynamicAttribute = new DynamicAttributes;

    const result1 = dynamicAttribute.isDynamicAttribute({ name: '[valid]' });
    const result2 = dynamicAttribute.isDynamicAttribute({ name: 'invalid' });

    expect(result1).toBe(true);
    expect(result2).toBe(false);
});

test('extractActualAttributeName() shoud extract the actual attribute name', () => {
    const dynamicAttribute = new DynamicAttributes;

    const result = dynamicAttribute.extractActualAttributeName({ name: '[attributeName]' });

    expect(result).toBe('attributeName');
});

test('generateCodeForActualValue() shoud give the code for dynamicAttrs', () => {
    const dynamicAttribute = new DynamicAttributes;

    const result = dynamicAttribute.generateCodeForActualValue({ value: 'this.something' });

    expect(result).toBe('classInst.widgetInst.something');
});


test('isCustomWidget() shoud determine weather the element is a valid custom widget or not', () => {
    const fakeWidget = {
        widgets: {
            'valid-widget': {}
        }
    }
    const fakeChildEl = {
        localName: 'valid-widget'
    }
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);
    const result = dynamicAttribute.isCustomWidget();

    expect(result).toBe(true);
});

test('getCurrentWidgetInstance() shoud give the instance of the current widget to the callback', () => {
    const fakeCustomWidget = { foo: 'bar' };
    const fakeWidget = {
        widgets: {
            'valid-widget': fakeCustomWidget
        },
        _customWidgets: [
            {
                id: 'abc123',
                instance: fakeCustomWidget,
            }
        ]
    }
    const fakeChildEl = {
        localName: 'valid-widget',
        children: [{ attributes: { id: { value: 'abc123' } } }]
    }
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);

    let widgetInst, isCallbackExecuted = false;

    dynamicAttribute.getCurrentWidgetInstance((widget) => {
        isCallbackExecuted = true;
        widgetInst = widget;
    });

    expect(isCallbackExecuted).toBe(true);
    expect(widgetInst).toEqual({ foo: 'bar' });
});

test('getCurrentWidgetInstance() shoud do nothing if the \'if\' condition goes false', () => {
    const fakeCustomWidget = { foo: 'bar' };
    const fakeWidget = {
        widgets: {
            'valid-widget': fakeCustomWidget
        },
        _customWidgets: [
            {
                id: 'abc123',
                instance: fakeCustomWidget,
            }
        ]
    }
    const fakeChildEl = {
        localName: 'valid-widget',
        children: [{ attributes: { id: { value: 'abc1234' } } }]
    }
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);

    let widgetInst, isCallbackExecuted = false;

    dynamicAttribute.getCurrentWidgetInstance((widget) => {
        isCallbackExecuted = true;
        widgetInst = widget;
    });

    expect(isCallbackExecuted).toBe(false);
});

test('setInitialValue() shoud set the initial value of the dynamic attribute', () => {
    const fakeWidget = {
        widgets: {
            'valid-widget': {}
        },
        attrs: {},
        $attrs: new Observable({ foo: 'bar' })
    }
    const fakeChildEl = {
        localName: 'valid-widget'
    };
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);

    dynamicAttribute.setInitialValue(fakeWidget, 'sum', 2 + 2, { foo: 'bar' });

    expect(fakeWidget.attrs.sum).toBe(4);
    expect(fakeWidget.$attrs.getVal()).toEqual({ foo: 'bar', sum: 4 });
});

test('listenForUpdateHandler() should subscribe for state and attr change', () => {
    const fakeWidget = {
        widgets: {
            'valid-widget': {}
        },
        $attrs: new Observable({}),
        $state: new Observable({})
    }
    const fakeChildEl = {
        localName: 'valid-widget'
    };
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);

    dynamicAttribute.listenForUpdateHandler(fakeWidget, 'sum', '2+2');

    expect(fakeWidget.$state.subscribers.length).toBe(1);
    expect(fakeWidget.$attrs.subscribers.length).toBe(1);
});

test('generateUpdateWidgetAttrFunction() shoud return a function that would update the attr', () => {
    const fakeWidget = {
        widgets: {
            'valid-widget': {}
        },
        $attrs: new Observable({}),
        $state: new Observable({})
    }
    const fakeChildEl = {
        localName: 'valid-widget'
    };
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);
    dynamicAttribute.generateUpdateWidgetAttrFunction(fakeWidget, 'sum', '2+2', { sum: 2 })();

    expect(fakeWidget.$attrs.getVal()).toEqual({ sum: 4 });
});

test('handleNativeElementDynamicAttribute() shoud set the attribute in case of native HTML element if actualValue exist', () => {
    let setAttributeRan = false, removeAttributeRan = false;

    const fakeWidget = {}
    const fakeChildEl = {
        setAttribute: () => {
            setAttributeRan = true;
        },
        removeAttribute: () => {
            removeAttributeRan = true;
        }
    };
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);
    dynamicAttribute.handleNativeElementDynamicAttribute('sum', 2 + 2, { name: ':sum' });

    expect(setAttributeRan).toBe(true);
    expect(removeAttributeRan).toBe(true);
});

test('handleNativeElementDynamicAttribute() shoud shoud do noting if actualValue doesn`t exist', () => {
    let setAttributeRan = false, removeAttributeRan = false;

    const fakeWidget = {}
    const fakeChildEl = {
        setAttribute: () => {
            setAttributeRan = true;
        },
        removeAttribute: () => {
            removeAttributeRan = true;
        }
    };
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);
    dynamicAttribute.handleNativeElementDynamicAttribute('sum', undefined, { name: ':sum' });

    expect(setAttributeRan).toBe(false);
    expect(removeAttributeRan).toBe(false);
});

test('run() shoud execute all the functions in case of customWidget', () => {
    let runCount = 0;

    const fakeWidget = {}
    const fakeChildEl = {};
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);

    dynamicAttribute.forEachAttrs = (callback) => {
        runCount++;
        callback({ name: ':sum', value: '2+2' });
    };
    dynamicAttribute.isDynamicAttribute = () => {
        runCount++;
        return true;
    };
    dynamicAttribute.extractActualAttributeName = () => { runCount++; };
    dynamicAttribute.generateCodeForActualValue = () => { runCount++; };
    dynamicAttribute.isCustomWidget = () => {
        runCount++;
        return true;
    }
    dynamicAttribute.getCurrentWidgetInstance = (callback) => {
        runCount++;
        callback({ $attrs: { getVal() { } } });
    }
    dynamicAttribute.setInitialValue = () => { runCount++; }
    dynamicAttribute.listenForUpdateHandler = () => { runCount++; }
    dynamicAttribute.run();

    expect(runCount).toBe(8);
});

test('run() shoud execute all the functions in case of native HTML element', () => {
    let runCount = 0;

    const fakeWidget = {}
    const fakeChildEl = {};
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);

    dynamicAttribute.forEachAttrs = (callback) => {
        runCount++;
        callback({ name: ':sum', value: '2+2' });
    };
    dynamicAttribute.isDynamicAttribute = () => {
        runCount++;
        return true;
    };
    dynamicAttribute.extractActualAttributeName = () => { runCount++; };
    dynamicAttribute.generateCodeForActualValue = () => { runCount++; };
    dynamicAttribute.isCustomWidget = () => {
        runCount++;
        return false;
    }
    dynamicAttribute.handleNativeElementDynamicAttribute = () => { runCount++; }
    dynamicAttribute.run();

    expect(runCount).toBe(6);
});


test('run() noting shoud execute if isDynamicAttribute() returns false', () => {
    let runCount = 0;

    const fakeWidget = {}
    const fakeChildEl = {};
    const dynamicAttribute = new DynamicAttributes(fakeWidget, fakeChildEl);

    dynamicAttribute.forEachAttrs = (callback) => {
        runCount++;
        callback({ name: ':sum', value: '2+2' });
    };
    dynamicAttribute.isDynamicAttribute = () => {
        runCount++;
        return false;
    };
    dynamicAttribute.run();

    expect(runCount).toBe(2);
});