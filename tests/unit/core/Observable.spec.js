import Observable, { Observable_Events } from '../../../src/core/Observable';

test('shoud be able to create Observable and get the value', () => {
    const obs = new Observable({ foo: 'bar' });

    expect(Object.keys(obs.getVal()).length).toEqual(1);
    expect(obs.getVal()).toEqual({ foo: 'bar' });
});

test('should be able to subscript to an Observable', () => {
    const obs = new Observable({ foo: 'bar' });

    obs.subscribe(Observable_Events, () => { });

    expect(obs.subscribers.length).toEqual(1);
});

test('should get notified when the value is changed', () => {
    const obs = new Observable({ foo: 'bar' });

    let didRun = false;

    obs.subscribe(Observable_Events.changed, () => {
        didRun = true;
    });

    obs.mutate({
        bar: 'foo'
    });

    expect(didRun).toEqual(true);
    expect(obs.getVal()).toEqual({
        bar: 'foo'
    });
});

test('should not notified if the channel is closed', () => {
    const obs = new Observable({ foo: 'bar' });

    let didRun = false;

    obs.subscribe(Observable_Events.changed, () => {
        didRun = true;
    });

    obs.closeChannel();
    obs.mutate({
        bar: 'foo'
    });

    expect(obs.isChannelOpen).toEqual(false);
    expect(didRun).toEqual(false);
    expect(obs.getVal()).toEqual({
        foo: 'bar'
    });
});

test('shoud notify changes only if it is a changed subscription.', () => {
    const obs = new Observable({ foo: 'bar' });

    let didRun1 = false;
    let didRun2 = false;

    obs.subscribe('randomEvent', () => {
        didRun1 = true;
    });
    obs.subscribe(Observable_Events.changed, () => {
        didRun2 = true;
    });

    obs.mutate({
        bar: 'foo'
    });

    expect(didRun1).toEqual(false);
    expect(didRun2).toEqual(true);
})