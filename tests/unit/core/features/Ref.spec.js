import Ref from "../../../../src/core/widget/features/Ref"

test('isRef shoud return true if is a valid ref', () => {
    const ref = new Ref;

    const result1 = ref.isRef({ name: 'ref' });
    const result2 = ref.isRef({ name: 'click' });

    expect(result1).toBe(true);
    expect(result2).toBe(false);
})

test('isCustomWidget shoud determine weather the element is a valid custom widget or not', () => {
    const fakeWidget = {
        widgets: {
            'valid-widget': {}
        }
    }
    const fakeChildEl = {
        localName: 'valid-widget'
    }
    const ref = new Ref(fakeWidget, fakeChildEl);
    const result = ref.isCustomWidget();

    expect(result).toBe(true);
});

test('handleIfNativeElement shoud register a ref', () => {
    const fakeWidget = {
        refs: {}
    };
    const fakeChildEl = { foo: 'bar' };
    const ref = new Ref(fakeWidget, fakeChildEl);

    ref.handleIfNativeElement({ value: 'value!' });

    expect(Object.keys(fakeWidget.refs).length).toBe(1);
    expect(fakeWidget.refs['value!'].dom).toEqual({ foo: 'bar' });
    expect(fakeWidget.refs['value!'].isCustomWidget).toBe(false);
});

test('handleIfCustomWidget shoud register a ref', () => {
    const fakeCustomWidget = { foo: 'bar' };
    const fakeWidget = {
        refs: {},
        _customWidgets: [
            { id: 'abc123', instance: fakeCustomWidget }
        ]
    };
    const fakeChildEl = {
        children: [{ attributes: { id: { value: 'abc123' } } }]
    };
    const ref = new Ref(fakeWidget, fakeChildEl);

    ref.handleIfCustomWidget({ value: 'value!' });

    expect(Object.keys(fakeWidget.refs).length).toBe(1);
    expect(fakeWidget.refs['value!'].widget).toEqual({ foo: 'bar' });
    expect(fakeWidget.refs['value!'].isCustomWidget).toBe(true);
});

test('handleIfCustomWidget should do nothing if is not a custom widget', () => {
    const fakeCustomWidget = { foo: 'bar' };
    const fakeWidget = {
        refs: {},
        _customWidgets: [
            { id: 'abcd1234', instance: fakeCustomWidget }
        ]
    };
    const fakeChildEl = {
        children: [{ attributes: { id: { value: 'abc123' } } }]
    };
    const ref = new Ref(fakeWidget, fakeChildEl);

    ref.handleIfCustomWidget({ value: 'value!' });

    expect(Object.keys(fakeWidget.refs).length).toBe(0);
})

test('run should run two funcion in case of not a ref', () => {
    const fakeWidget = {
        refs: {}
    };
    const fakeChildEl = { foo: 'bar' };
    const ref = new Ref(fakeWidget, fakeChildEl);
    let functionRunCount = 0;

    ref.forEachAttrs = (callback) => {
        functionRunCount++;
        callback();
    };
    ref.isRef = () => {
        functionRunCount++;
        return false;
    }
    ref.isCustomWidget = () => {
        functionRunCount++;
        return false;
    }
    ref.handleIfNativeElement = () => {
        functionRunCount++;
    }
    ref.run();

    expect(functionRunCount).toBe(2);
});

test('run should run all the funcion in case of native element', () => {
    const fakeWidget = {
        refs: {}
    };
    const fakeChildEl = { foo: 'bar' };
    const ref = new Ref(fakeWidget, fakeChildEl);
    let functionRunCount = 0;

    ref.forEachAttrs = (callback) => {
        functionRunCount++;
        callback();
    };
    ref.isRef = () => {
        functionRunCount++;
        return true;
    }
    ref.isCustomWidget = () => {
        functionRunCount++;
        return false;
    }
    ref.handleIfNativeElement = () => {
        functionRunCount++;
    }
    ref.run();

    expect(functionRunCount).toBe(4);
});

test('run should run all the funcion in case of custom widget', () => {
    const fakeWidget = {
        refs: {}
    };
    const fakeChildEl = { foo: 'bar' };
    const ref = new Ref(fakeWidget, fakeChildEl);
    let functionRunCount = 0;

    ref.forEachAttrs = (callback) => {
        functionRunCount++;
        callback();
    };
    ref.isRef = () => {
        functionRunCount++;
        return true;
    }
    ref.isCustomWidget = () => {
        functionRunCount++;
        return true;
    }
    ref.handleIfCustomWidget = () => {
        functionRunCount++;
    }
    ref.run();

    expect(functionRunCount).toBe(4);
});