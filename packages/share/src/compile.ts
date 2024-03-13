import { generateBlockId } from ".";
import { generateParagraphData } from "@super-doc/api";

export const compileParagraph = (str) => {
    const textArr = str.split('\n');
    const blocks = textArr.map(text => {
        const paragraphData = generateParagraphData() as any;
        paragraphData.data.text = text;
        return paragraphData;
    });
    return blocks;
}
