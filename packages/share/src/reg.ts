export const IMAGE_MD_REGEX = /!\[(.*?)\]\((.*?)\)( |&nbsp;)/;

export const getMDImage = function (str) {
    const matches = str.match(IMAGE_MD_REGEX);

    if (matches) {
        return {
            desc: matches[1],
            url: matches[2]
        }
    } else {
        return {
            desc: undefined,
            url: undefined
        }
    }
}