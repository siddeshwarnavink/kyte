import * as utils from '../../../src/shared/utility';

test('shoud extract the value from string', () => {
    const string1 = `This is a {{value}} and this must be {{extracted}}`;
    const string2 = `A string which do not have any extracts`;

    const extractor = utils.createExtractor(['{{', '}}']);
    const result1 = extractor(string1);
    const result2 = extractor(string2);

    expect(result1.length).toBe(2);
    expect(result1).toEqual(['{{value}}', '{{extracted}}']);
    expect(result2.length).toEqual(0);
    expect(result2).toEqual([]);
});

test('shoud generate random string each time', () => {
    const random1 = utils.generateId(8);
    const random2 = utils.generateId(8);
    const random3 = utils.generateId(12);
    const random4 = utils.generateId();

    expect(random2).not.toEqual(random1);

    expect(random1.split('').length).toEqual(8);
    expect(random2.split('').length).toEqual(8);
    expect(random3.split('').length).toEqual(12);
    expect(random4.split('').length).toEqual(18);
});

test('shoud say weather the element is found in DOM tree or not', () => {
    const rootNode = `
        <div>
            <section>
                <div id="requiredElement"></div>
            </section>
        </div>
    `;

    const requiredElement1 = `<div id="requiredElement"></div>`;
    const requiredElement2 = `<article id="elementNotFound"></article>`


    const result1 = utils.htmlContains(rootNode, requiredElement1);
    const result2 = utils.htmlContains(rootNode, requiredElement2);

    expect(result1).toEqual(true);
    expect(result2).toEqual(false);
});

test('convert element array to HTMLCollection', () => {
    const elm1 = document.createElement("p")
    const elm2 = document.createElement("p")
    const elmArray = [elm1, elm2];

    const result = utils.toHTMLCollection(elmArray);

    expect(result.length).toEqual(2);
});

test('shoud find the array difference', () => {
    const array1 = ['a', 'b', 'c'];
    const array2 = ['b', 'c'];
    const array3 = ['d', 'e'];

    const result1 = utils.arrayDifference(array1, array2);
    const result2 = utils.arrayDifference(array1, array3);

    expect(result1.length).toEqual(1);
    expect(result1).toEqual(['a']);
    expect(result2.length).toEqual(5);
    expect(result2).toEqual(['a', 'b', 'c', 'd', 'e']);
});