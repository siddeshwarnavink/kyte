function htmlContains(rootHtml, pieceHtml) {
    const parser = new DOMParser();

    let rootDom = parser.parseFromString(rootHtml, "text/html");
    rootDom = rootDom.querySelector('body').children[0];

    let pieceDom = parser.parseFromString(pieceHtml, "text/html");
    pieceDom = pieceDom.querySelector('body').children[0];

    return rootDom.querySelector(pieceDom.localName) ? true : false;
}

export default htmlContains;