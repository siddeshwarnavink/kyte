function combinedHTML(html1, html2, findTerm) {
    html1 = html1.trim();
    html2 = html2.trim();

    console.log(findTerm);

    return html1;
}

function createExtractor([beg, end]) {
    const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm');
    return function (str) {
        if (!str.match(matcher)) {
            return [];
        }
        return str.match(matcher);
    };
}


function generateId(length = 18) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function htmlContains(rootHtml, pieceHtml) {
    const parser = new DOMParser();

    let rootDom = parser.parseFromString(rootHtml, 'text/html');
    rootDom = rootDom.querySelector('body').children[0];

    let pieceDom = parser.parseFromString(pieceHtml, 'text/html');
    pieceDom = pieceDom.querySelector('body').children[0];

    return rootDom.querySelector(pieceDom.localName) ? true : false;
}

function toHTMLCollection(elementsArray) {
    const docFragment = document.createDocumentFragment();

    elementsArray.forEach(element => {
        docFragment.appendChild(element);
    });

    return docFragment.children;
}

function arrayDifference(a1, a2) {
    let a = [], diff = [];

    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (let k in a) {
        diff.push(k);
    }

    return diff;
}

export {
    combinedHTML,
    createExtractor,
    generateId,
    htmlContains,
    toHTMLCollection,
    arrayDifference
};