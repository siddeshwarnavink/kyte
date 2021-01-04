// An utility function for extracting value in DOM
function createExtractor([beg, end]) {
    const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm');
    return function (str) {
        if (!str.match(matcher)) {
            return []
        }
        return str.match(matcher);
    }
}

export default createExtractor;