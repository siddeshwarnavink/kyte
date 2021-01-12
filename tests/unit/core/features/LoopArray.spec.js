import LoopArray from "../../../../src/core/widget/features/LoopArray"

test('isLoopArray shoud determine weather it is a loopArray or not', () => {
    const loopArray = new LoopArray();

    const result1 = loopArray.isLoopArray({ name: 'looparray' });
    const result2 = loopArray.isLoopArray({ name: 'click' });

    expect(result1).toBe(true);
    expect(result2).toBe(false);
});

test('isCustomWidget shoud determine weather the element is a valid custom widget or not', () => {
    const fakeWidget = {
        widgets: {
            'valid-widget': {}
        }
    }
    const fakeChildEl = {
        localName: 'valid-widget'
    }
    const loopArray = new LoopArray(fakeWidget, fakeChildEl);
    const result = loopArray.isCustomWidget();

    expect(result).toBe(true);
});

test('getActualArray shoud return the actual array', () => {
    const loopArray = new LoopArray;
    const result = loopArray.getActualArray({ value: `[1, 2, 3]` });

    expect(result).toEqual([1, 2, 3]);
});