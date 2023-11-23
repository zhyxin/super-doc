import { generateBlockId } from ".";

export const compileParagraph = (str) => {
    const textArr = str.split('\n');
    const blocks = textArr.map(text => {
        return {
            id: generateBlockId(),
            type: 'Paragraph',
            data: {
                text,
            },
            class: 'Paragraph',
        }
    });
    return blocks;
}
