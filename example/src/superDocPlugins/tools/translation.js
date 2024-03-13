import { translationEnglishApi, translationHKhApi } from '../../api/index';

export const isChinese = (str) => {
  const regex = /[\u4e00-\u9fa5]/gm;
  return regex.test(str);
}

// 段落按句子串行翻译
export const translateBySentence = async (block, isSimple) => {
  let isTranslationStarted = false;
  // 原始的文本内容
  const original = block.data.text;
  // 去除带样式时的 HTML 标签
  const plainText = block.data.text.replace(/(<([^>]+)>)/gi, "");
  // 分割用的正则表达式对应句号、问号、感叹号, 过滤掉空的句子
  const separatorReg = isChinese(plainText) ? /。|？|！/ : /[.!?]/;
  const splitText = plainText.split(separatorReg).filter(sentence => sentence.trim() !== "");
  // 请求的 api
  const translateApi = !isSimple ? translationEnglishApi : translationHKhApi;
  // 串行翻译
  for (let sentence of splitText) {
    sentence = sentence.trim();
    // 若不是有效句子，则跳过
    if (!sentence) continue;
    // 根据分隔符判断句子的结束标识
    const separatorIndex = plainText.indexOf(sentence.trim());
    let separator = '';  // 分隔符
    if (separatorIndex !== -1) {
      separator = plainText.charAt(separatorIndex + sentence.trim().length);
    }

    await translateApi({
      "text": sentence + separator,
      "is_simple": isSimple
    }).then(translate => {
      if (!isTranslationStarted) {
        // 第一次请求完成后清空原来的内容
        block.data.text = "";
        isTranslationStarted = true;
      }
      // 将翻译后的内容添加到text中
      block.data.text += translate;
      block.data.translate = original;
    });
  }
}
