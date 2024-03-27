import { generateBlockId } from ".";
import { generateParagraphData , generateHeadData ,generateListData, generateImageData, generateTodoData} from "@super-doc/api";

export const compileParagraph = (str) => {
    const textArr = str.split('\n');
    const blocks = textArr.map(text => {
        const paragraphData = generateParagraphData() as any;
        paragraphData.data.text = text;
        return paragraphData;
    });
    return blocks;
}

export const compileHead = (str:string,level:string) =>{
    const textArr = str.split('\n');
    const blocks = textArr.map(text => {
        const headData = generateHeadData(level) as any;
        headData.data.text = text;
        return headData;
    });
    return blocks;
}
export const compileListData = (list:any[],type:string) =>{
    const listData = generateListData(type) as any;
    list.forEach((item)=>{
        !item.id && (item.id = generateBlockId())
        listData.data.list.push(item)
    })
    return listData;
}

export const compileImageData = ({desc,url}) =>{
    let imageData = generateImageData({desc,url})
    return imageData
}
export const compileTodoData = (list:any[]) =>{
    const toDoData = generateTodoData() as any;
    list.forEach((item)=>{
        !item.id && (item.id = generateBlockId())
        toDoData.data.list.push(item)
    })
    return toDoData;
}
