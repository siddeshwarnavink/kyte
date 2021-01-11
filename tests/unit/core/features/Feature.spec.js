import Feature from '../../../../src/core/widget/features/Feature';

test('forEachAttrs should loop through all attributes', () => {
    const feature = new Feature({ expected: 'widgetInst' }, { expected: 'childEl' }, { foo: 'bar' });
    let loopCount = 0;
    let receivedValue;

    feature.forEachAttrs((value) => {
        loopCount++;
        receivedValue = value;
    });


    expect(feature.widgetInst).toEqual({ expected: 'widgetInst' });
    expect(feature.childEl).toEqual({ expected: 'childEl' })
    expect(feature.childElAttributes).toEqual({ foo: 'bar' });

    expect(loopCount).toBe(1);
    expect(receivedValue).toBe('bar');
});

test('run used directly should throw error', () => {
    const feature = new Feature({ expected: 'widgetInst' }, { expected: 'childEl' }, { foo: 'bar' });

    const shouldThrowError = () => {
        feature.run();
    };

    expect(shouldThrowError).toThrow(Error);
});