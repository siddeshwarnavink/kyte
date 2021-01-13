import StringInterpolation from '../../../../src/core/features/StringInterpolation';
import Observable from '../../../../src/core/Observable';

test('forEachInterpolation should loop for each extract', () => {
    const templateCode = `<p>This is with {{ one }} and {{ two }} extract(s)</p>`;
    const stringInterpolation = new StringInterpolation({
        template: templateCode
    }, templateCode, {});
    let loopCount = 0;
    const extractsReceived = [];

    stringInterpolation.forEachInterpolation((extract) => {
        loopCount++;
        extractsReceived.push(extract);
    });

    expect(loopCount).toBe(2);
    expect(extractsReceived).toEqual(['{{ one }}', '{{ two }}']);
});

test('generateCodeToRun shoud generate correct code', () => {
    const extract1 = `{{ one }}`;
    const extract2 = `{{ this.state.two }}`;

    const templateCode = `<p>This is with {{ one }} and {{ two }} extract(s)</p>`;
    const stringInterpolation = new StringInterpolation({
        template: templateCode
    }, templateCode, {});

    const result1 = stringInterpolation.generateCodeToRun(extract1);
    const result2 = stringInterpolation.generateCodeToRun(extract2);

    expect(result1).toBe('one');
    expect(result2).toBe('classInst.widgetInst.state.two')
});

test('createKyteContaner shoud actually create a kyte container', () => {
    const template = `<p>The sum is {{ 2+2 }}</p>`;
    const fakeDOM = { innerHTML: template }
    const stringInterpolation = new StringInterpolation({
        template
    }, fakeDOM, {});

    const wrapperId = stringInterpolation.createKyteContaner('{{ 2+2 }}', 2 + 2);

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(fakeDOM.innerHTML, 'text/xml');


    expect(htmlDoc.getElementsByTagName('kyte-container').length).toBe(1);
    expect(htmlDoc.getElementsByTagName('kyte-container')[0].tagName).toBe('kyte-container');
    expect(htmlDoc.getElementsByTagName('kyte-container')[0].getAttribute('id')).toBe(wrapperId);
});

test('subscribeForUpdates shoud register to the widget & subscribe in Observable', () => {
    const template = `<p>The sum is {{ 2+2 }}</p>`;
    const fakeDOM = { innerHTML: template };
    const fakeWidget = {
        template,
        _stringInterpolations: [],
        $state: new Observable({}),
        $attrs: new Observable({})
    }
    const stringInterpolation = new StringInterpolation(fakeWidget, fakeDOM, {});
    stringInterpolation.subscribeForUpdates();

    expect(fakeWidget._stringInterpolations.length).toBe(1);
    expect(Object.keys(fakeWidget._stringInterpolations[0])).toEqual(["id", "update"]);

    expect(fakeWidget.$state.subscribers.length).toBe(1);
    expect(fakeWidget.$attrs.subscribers.length).toBe(1);
});

test('createSubscribeForUpdateFunction should return a function that could interact to DOM', () => {
    const template = `<p>The sum is {{ 2+2 }}</p>`;
    const fakeDOM = { innerHTML: template };
    const fakeWidget = {
        template,
        _stringInterpolations: [],
        $state: new Observable({}),
        $attrs: new Observable({})
    }
    const stringInterpolation = new StringInterpolation(fakeWidget, fakeDOM, {});

    const updateFunction = stringInterpolation.createSubscribeForUpdateFunction('superRandomString', '2+2');

    document.body.innerHTML = `
        <kyte-container id="superRandomString">
            This value will be replaced soon.
        </kyte-container>
    `;

    updateFunction();

    expect(document.getElementById('superRandomString').innerHTML).toBe('4');
});

test('createSubscribeForUpdateFunction should not affect the DOM if invalid ID is passed', () => {
    const template = `<p>The sum is {{ 2+2 }}</p>`;
    const fakeDOM = { innerHTML: template };
    const fakeWidget = {
        template,
        _stringInterpolations: [],
        $state: new Observable({}),
        $attrs: new Observable({})
    }
    const stringInterpolation = new StringInterpolation(fakeWidget, fakeDOM, {});

    const updateFunction = stringInterpolation.createSubscribeForUpdateFunction('superRandomString!', '2+2');

    document.body.innerHTML = `
        <kyte-container id="superRandomString">
            This value will be replaced soon.
        </kyte-container>
    `;

    updateFunction();

    expect(document.getElementById('superRandomString').innerHTML.trim()).toBe('This value will be replaced soon.');
});

test('all the functions must be executed when run() is executed', () => {
    const template = `<p>The sum is {{ 2+2 }}</p>`;
    const fakeDOM = { innerHTML: template };
    const fakeWidget = {
        template,
        _stringInterpolations: [],
        $state: new Observable({}),
        $attrs: new Observable({})
    }
    const stringInterpolation = new StringInterpolation(fakeWidget, fakeDOM, {});
    let runCount = 0;

    stringInterpolation.forEachInterpolation = (callback) => {
        callback();
        runCount++;
    };
    stringInterpolation.generateCodeToRun = () => { runCount++; };
    stringInterpolation.createKyteContaner = () => { runCount++; };
    stringInterpolation.subscribeForUpdates = () => { runCount++; };
    stringInterpolation.run();

    expect(runCount).toBe(4);
});