import EventListener from '../../../../src/core/widget/features/EventListener';

test('checkForEventListner should return true for correct EventListners', () => {
    const eventListner = new EventListener();

    const result1 = eventListner.checkForEventListner({ name: 'invalid' });
    const result2 = eventListner.checkForEventListner({ name: '#valid' })

    expect(result1).toBe(false);
    expect(result2).toBe(true);
});

test('getEventName should extract the eventName from attribute name', () => {
    const eventListner = new EventListener();

    const result1 = eventListner.getEventName({ name: '#one' });
    const result2 = eventListner.getEventName({ name: '#twoAndThree' });

    expect(result1).toBe('one');
    expect(result2).toBe('twoAndThree');
});

test('checkForEventAlreadyRegistered shoud return true if the event is already registered', () => {
    const eventListner = new EventListener({
        _eventListeners: [
            { type: 'click', element: { innerHTML: '<html-element>' } }
        ]
    }, { innerHTML: '<html-element>' });

    const result1 = eventListner.checkForEventAlreadyRegistered('click');
    const result2 = eventListner.checkForEventAlreadyRegistered('hover');

    expect(result1).toBe(true);
    expect(result2).toBe(false);
});

test('createAddEventFunction shoud return a function which should add a event', () => {
    const fakeWidget = {
        _eventListeners: []
    };
    const eventListner = new EventListener(fakeWidget, { innerHTML: '<html-element>' });
    let isEventListening = false;

    const result = eventListner.createAddEventFunction();
    result('click', () => { }, {
        addEventListener: () => { isEventListening = true; }
    });

    expect(fakeWidget._eventListeners.length).toBe(1);
    expect(isEventListening).toBe(true);
});

test('bindEventHandler should not be handled by the parent element', () => {
    const fakeWidget = {
        _eventListeners: [],
        template: `
            <div>
                <to>
                    <nothing />
                </to>
            </div>
        `
    };
    const eventListner = new EventListener(fakeWidget, {
        outerHTML: `
            <div>
                <custom-widget></custom-widget>
            </div>
        `
    });

    const result = eventListner.bindEventHandler();

    expect(result).toBe(false);
});

test('bindEventHandler shoud actually register an event', () => {
    const fakeWidget = {
        _eventListeners: [],
        template: `
            <div>
                <custom-widget></custom-widget>
            </div>
        `
    };
    const fakeChildEl = {
        outerHTML: `<custom-widget></custom-widget>`
    }
    const eventListner_ = new EventListener(fakeWidget, fakeChildEl);
    let addEventRan = false;
    let addEventArgs = {};

    const result = eventListner_.bindEventHandler(
        (eventType, eventHandler, childEl) => {
            addEventRan = true;
            addEventArgs = { eventType, eventHandler, childEl };
        },
        {
            name: ':click',
            value: "{2+2}"
        }
    );

    expect(result).not.toBe(false);
    expect(Object.keys(fakeChildEl).length).toBe(2);
    expect(fakeChildEl.value).toBe(4);
    expect(addEventRan).toBe(true);

    expect(Object.keys(addEventArgs).length).toBe(3);
});

test('createOtherEventHandlerFunction should return a function that should execute the code in the value', () => {
    const fakeWidget = {
        _eventListeners: [],
        template: `
            <div>
                <custom-widget></custom-widget>
            </div>
        `
    };
    const fakeChildEl = {
        outerHTML: `<custom-widget></custom-widget>`
    }
    const eventListner = new EventListener(fakeWidget, fakeChildEl);
    let isFunctionRan = false;

    global.functionRanHandler = () => {
        isFunctionRan = true;
    }

    const result = eventListner.createOtherEventHandlerFunction({ value: `{global.functionRanHandler}` });
    result();

    expect(isFunctionRan).toBe(true);
});

test('otherEventHandler shoud actually register an event', () => {
    const fakeWidget = {
        _eventListeners: [],
        template: `
            <div>
                <custom-widget></custom-widget>
            </div>
        `
    };
    const fakeChildEl = {
        outerHTML: `<custom-widget></custom-widget>`
    }
    const eventListner = new EventListener(fakeWidget, fakeChildEl);
    let isAddEventRan = false;

    eventListner.otherEventHandler({
        name: ':click'
    }, 'click', () => {
        isAddEventRan = true;
    });

    expect(isAddEventRan).toBe(true);
});

test('run shoud execute all the other functions when the event is bind', () => {
    const fakeWidget = {
        _eventListeners: [],
        template: `
            <div>
                <custom-widget></custom-widget>
            </div>
        `
    };
    const fakeChildEl = {
        outerHTML: `<custom-widget></custom-widget>`,
        addEventListener: () => {
            isEventListening = true;
        }
    }
    const eventListner = new EventListener(fakeWidget, fakeChildEl);
    let functionRunCount = 0;
    let isEventListening = false;

    eventListner.forEachAttrs = (callback) => {
        functionRunCount++;
        callback({ name: ':bind', value: '' });
    };
    eventListner.checkForEventListner = () => {
        functionRunCount++;
        return false;
    }
    eventListner.getEventName = () => {
        functionRunCount++;
        return 'bind';
    }
    eventListner.checkForEventAlreadyRegistered = () => {
        functionRunCount++;
        return true;
    }
    eventListner.bindEventHandler = () => {
        functionRunCount++;
    }
    eventListner.run();

    expect(functionRunCount).toBe(2);
    expect(isEventListening).toBe(false);
});

test('run shoud execute all the other functions when the event is not bind', () => {
    const fakeWidget = {
        _eventListeners: [],
        template: `
            <div>
                <custom-widget></custom-widget>
            </div>
        `
    };
    const fakeChildEl = {
        outerHTML: `<custom-widget></custom-widget>`,
        addEventListener: () => {
            isEventListening = true;
        }
    }
    const eventListner = new EventListener(fakeWidget, fakeChildEl);
    let functionRunCount = 0;
    let isEventListening = false;

    eventListner.forEachAttrs = (callback) => {
        functionRunCount++;
        callback({ name: ':click', value: '' });
    };
    eventListner.checkForEventListner = () => {
        functionRunCount++;
        return false;
    }
    eventListner.getEventName = () => {
        functionRunCount++;
        return 'click';
    }
    eventListner.checkForEventAlreadyRegistered = () => {
        functionRunCount++;
        return true;
    }
    eventListner.otherEventHandler = () => {
        functionRunCount++;
    }
    eventListner.run();

    expect(functionRunCount).toBe(2);
    expect(isEventListening).toBe(false);
});