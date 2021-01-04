function toHTMLCollection(elementsArray) {
    const docFragment = document.createDocumentFragment();

    elementsArray.forEach(element => {
        docFragment.appendChild(element);
    });

    return docFragment.children;
}

export default toHTMLCollection;