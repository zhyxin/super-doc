import { compileImageData, deepCloneRefreshId } from "@super-doc/share";
import { BlockInstance, OutputBlockData } from "@super-doc/types";
import BlockManager from "../../../../blockManager/src";
import KeyDown from "../keyDown";
import { generateImageData, uploadImage } from "@super-doc/api";
import * as _ from "@super-doc/share";

/**
 * 复制 keydown keycode识别的复制 ctrl+c
 * @param event
 */
export const copyEventByKeyBoardCallBack = function (event: KeyboardEvent) {
  let that: KeyDown = this;
  let manager: BlockManager = that.Event["Editor"].BlockManager;
  try {
    if (that.isCheckAllStatus()) {
      console.log("lfjs:全选复制");
      copyEventByClipboardCallBack.call(that, event, manager.curentFocusBlock);
      event.stopPropagation();
      event.preventDefault();
    } else if (that.isCheckSingleBlockStatus()) {
      // 单段被复制
      event.stopPropagation();
    } else {
      console.log("【superDoc】：执行原生复制事件");
    }
  } catch (e) {
    console.error(`【superDoc_error】:执行复制失败${e}`);
  }
};

/**
 * 复制原生事件
 * @param event
 */
export const copyEventByClipboardCallBack = function (
  event: ClipboardEvent,
  instance: BlockInstance
) {
  console.log("执行次数", instance);
  let that: KeyDown = this;
  // 默认文本的复制
  let manager = that.Event["Editor"].BlockManager;
  manager.currentCopyBlockInfo.id = instance.id;
  manager.currentCopyBlockInfo.block = instance;
  manager.currentCopyBlockInfo.data = [];
  manager.currentCopyBlockInfo.content = "";
  // 设置为文本类型
  if (manager.currentSelectionBlockInfo.type == "text") {
    manager.currentCopyBlockInfo.type = "text";
    event.clipboardData?.setData(
      "text/plain",
      manager.currentSelectionBlockInfo.string
    );
    // 解析文本类型的block
    manager.currentCopyBlockInfo.data = instance.instance.compileData(
      instance,
      manager.currentSelectionBlockInfo.content
    );
    // 文本类型，代表单行复制。所以阻止默认的复制事件
    event.preventDefault();
  } else {
    manager.currentCopyBlockInfo.type = "block";
    let refreshBlockData = deepCloneRefreshId(
      manager.currentSelectionBlockInfo.data,
      ["id"]
    );
    manager.currentCopyBlockInfo.data = refreshBlockData;
    manager.currentSelectionBlockInfo.data.forEach((item) => {
      let block = manager.findBlockInstanceForId(item.id);
      let copyEventCallBack = block.target?.state?.instance?.copyEventCallBack;
      copyEventCallBack && copyEventCallBack(that, event, block.target.state);
    });
  }
};

/**
 * 粘贴事件 keydown keycode识别的粘贴
 * 1、是否全选
 * 2、是否单段block完全选择替换
 * @param event
 */
export const pasteEventByKeyBoardCallBack = function (event: KeyboardEvent) {
  let that = this;
  let manager: BlockManager = that.Event["Editor"].BlockManager;
  try {
    if (that.isCheckAllStatus()) {
      console.log("粘贴全选:lfjs");
      event.preventDefault();
    } else if (that.isCheckSingleBlockStatus()) {
      // 单段全部 - 直接替换block
      // let copyBlockData = manager.currentCopyBlock[0].getBlockData();
      let copyBlockData = manager.currentCopyBlock.map((m) => {
        let blockData = m.getBlockData();
        let deepCloneBlock = deepCloneRefreshId(blockData, [
          "id",
        ]) as OutputBlockData;
        return deepCloneBlock;
      });
      let focusBlock = manager.curentFocusBlock;
      // 拷贝block内容刷新id

      manager.replaceCurrentBlock(copyBlockData, focusBlock.id);
      event.preventDefault();
    }
  } catch (e) {
    console.error(`【superDoc_error】: 执行粘贴事件失败${e}`);
  }
};

/**
 * 粘贴事件 原生事件的粘贴 paste
 * 1、是否单段部分选择
 * 2、TODO：是否跨段落选择和粘贴
 * @param event
 */
export const pasteEventByClipboardCallBack = function (event: ClipboardEvent) {
  // if (event.target["getAttribute"]("id") !== "superdoc-paragraph") return;
  console.log("【superDoc】: 执行粘贴_总线层");
  try {
    let that: KeyDown = this;
    let manager = that.Event["Editor"].BlockManager;
    let focusBlock = manager.curentFocusBlock;
    let clipboardData = event.clipboardData;
    let pasteEventCallBack = focusBlock.instance.pasteEventCallBack;
    // let { block, type, status, data } = manager.currentCopyBlockInfo;
    if (clipboardData.types.includes("Files")) {
      pasteFile(that, event);
    } else if (pasteEventCallBack) {
      pasteEventCallBack(that, event);
      return;
    } else {
    }
  } catch (e) {
    console.error(`【superDoc_error】: 执行粘贴事件失败${e}`);
  }
};

export const cutEventByClipboardCallBack = function (
  event: ClipboardEvent,
  instance: BlockInstance
) {
  console.log("【superDoc】: 执行剪切_总线层");

  try {
    let that: KeyDown = this;
    let manager = that.Event["Editor"].BlockManager;
    // 默认文本的复制 剪切都是这个逻辑
    manager.currentCopyBlockInfo.id = instance.id;
    let selection = window.getSelection();
    let selectedRange = selection.getRangeAt(0);
    manager.currentCopyBlockInfo.block = instance;
    manager.currentCopyBlockInfo.data = [];
    // 设置为文本类型
    if (manager.currentSelectionBlockInfo.type == "text") {
      manager.currentCopyBlockInfo.type = "text";
      event.clipboardData?.setData(
        "text/plain",
        manager.currentSelectionBlockInfo.string
      );
      // 解析文本类型的block TODO：instance 改成工具栏获取
      manager.currentCopyBlockInfo.data = instance.instance.compileData(
        instance,
        manager.currentSelectionBlockInfo.content
      );
      let extractContents = selectedRange.extractContents();
      console.log("lfjs：剪切事件");
      event.preventDefault()
    } else {
      manager.currentCopyBlockInfo.type = "block";
      let refreshBlockData = deepCloneRefreshId(
        manager.currentSelectionBlockInfo.data,
        ["id"]
      );
      manager.currentCopyBlockInfo.data = refreshBlockData;
      // 清除选中内容
      let extractContents = selectedRange.extractContents();
      manager.currentSelectionBlockInfo.data.forEach((item, index) => {
        let block = manager.findBlockInstanceForId(item.id);
        // 逻辑是选取的内容中间全部去除。执行剪切事件。 (不严谨暂时处理)
        if (
          index == 0 ||
          manager.currentSelectionBlockInfo.data.length - 1 == index
        ) {
          let cutEventCallBack = block.target.state.instance.cutEventCallBack;
          cutEventCallBack &&
            cutEventCallBack(that, event, item, block.target.state);
        } else {
          manager.removeBlock(item.id);
        }
      });
      event.preventDefault();
    }
  } catch (e) {
    console.error(`【superDoc_error】: 执行剪切事件失败${e}`);
  }
};

export const getSelectionBlockData = function (
  event: ClipboardEvent,
  instance?: BlockInstance
) {
  console.log("【superDoc】: 执行获取选中的文本");
  try {
    let that = this;
    let manager = that.Editor.BlockManager;
    let selection = window.getSelection();
    let selectedRange = selection.getRangeAt(0);
    let cloneContents = selectedRange.cloneContents();
    let selectFragment = document.createElement("div");
    selectFragment.appendChild(cloneContents);
    // 默认文本的复制
    manager.currentSelectionBlockInfo.id = instance.id;
    manager.currentSelectionBlockInfo.block = instance;
    manager.currentSelectionBlockInfo.data = [];
    if (selectFragment.innerHTML) {
      // 如何存在选择内容
      let selectedBlock = selectFragment.querySelectorAll("[block-id]") || [];
      let childNode = selectFragment.querySelector("[parent-id]");
      // 检查是否有blockId的模块被选中
      manager.currentSelectionBlockInfo.content = selectFragment.innerHTML;
      if (selectedBlock.length == 0) {
        manager.currentSelectionBlockInfo.string = selectedRange.toString();
        manager.currentSelectionBlockInfo.type = "text";
        manager.currentSelectionBlockInfo.data = instance.instance.compileData(
          instance,
          selectFragment.innerHTML
        );
        if (childNode) {
          manager.currentSelectionBlockInfo.data = [];
          let blockId = childNode.getAttribute("parent-id");
          let blockInstance = manager.blockInstances.find(
            (b) => b.id == blockId
          );
          if (blockInstance) {
            let selectionCallBack = blockInstance.instance.selectionCallBack;
            selectionCallBack &&
              selectionCallBack(that, event, selectFragment, blockInstance);
            manager.currentSelectionBlockInfo.type = "block";
          }
        }
      } else {
        manager.currentSelectionBlockInfo.type = "block";
        selectedBlock.forEach((item) => {
          let blockId = item.getAttribute("block-id");
          let blockInstance = manager.blockInstances.find(
            (b) => b.id == blockId
          );
          if (blockInstance) {
            let selectionCallBack = blockInstance.instance.selectionCallBack;
            selectionCallBack &&
              selectionCallBack(that, event, item, blockInstance);
          }
        });
      }
      console.log(
        manager.currentSelectionBlockInfo,
        "currentSelectionBlockInfo"
      );
    }
  } catch (e) {
    console.error(`【superDoc_error】: 获取选中的文本内容失败${e}`);
  }
};

// 变更blockData的文本 针对类型是head和Paragraph
export const changeBlockDataText = function (
  text: string,
  callback?: Function
) {
  let that: KeyDown = this;
  let replacementText = document.createTextNode(text);
  let blockManager = that.Event["Editor"].BlockManager;
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);
  let focusBlock = blockManager.curentFocusBlock;
  // 删除当前选择范围中的内容
  range.deleteContents();
  range.insertNode(replacementText); // 在选择范围的起始位置插入替换文本
  // 清除之前的选择范围
  selection.removeAllRanges();
  // 将新的选择范围添加到文档中
  selection.addRange(range);
  if (!callback) {
    focusBlock.data.text =
      (range.startContainer as any).wholeText ||
      (range.startContainer as any).innerHTML;
  } else {
    callback(range);
  }
  // 将选择范围定位到替换文本的末尾
  range.collapse(false);
};

export async function pasteFile(that: KeyDown, event) {
  // 获取剪贴板中的数据
  let items = event.clipboardData.items;
  let manager = that.Event["Editor"].BlockManager;
  let focusBlock = manager.curentFocusBlock;
  // 图片默认追加不做处理
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      // 获取图片文件
      let blob = items[i].getAsFile();
      try {
        let imageBlockData = generateImageData({
          desc: "粘贴图",
          url: URL.createObjectURL(blob),
        });
        // 将图片添加到页面中
        manager.replaceCurrentBlock([imageBlockData], focusBlock.id);
        // let url  = manager.config.imageConfig.uploadHost
        // const result = await uploadImage({ file: blob },url);
        // const path = result?.data?.msg;
        // console.log(`【superDoc】: 图片粘贴`);
        // if (!path) {
        //   console.log(`【superDoc】: 图片粘贴返回无内容`);
        //   event.preventDefault();
        //   return;
        // }
        // let imageBlockData = generateImageData({
        //   desc: "粘贴图",
        //   url: path,
        // });
        // manager.replaceCurrentBlock([imageBlockData], focusBlock.id);
        // 阻止默认的粘贴行为
        event.preventDefault();
      } catch (e) {
        // let imageBlockData = generateImageData({desc:"粘贴图",url:URL.createObjectURL(blob)})
        // // 将图片添加到页面中
        // manager.replaceCurrentBlock([imageBlockData], focusBlock.id);
        console.error(`【superDoc_error】:上传图片失败${e}`);
      }
    }
  }
}

// question
// block删除时会获取不到
