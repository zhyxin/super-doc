<template>
  <p
    ref="super-paragraph"
    id="superdoc-inter-p"
    class="super-block"
    contenteditable
    placeholder='"/"插入内容'
    @input.stop.self="contentChange"
    style="padding: 8px 0; margin: 0; line-height: 21px"
  ></p>
</template>

<script>
/**
 * 组件需要把数据同步回去的方案一：
 *
 * API提供更新json的方法，插件调用该方法去更新指定blockID的数据
 *
 */
import { showCommand, addListener, syncDom, markdownSyntaxTransform } from "@super-doc/api";
// this.config.Editor.UI.command.visible = true;
export default {
  props: ["$superConfig"],
  data() {
    return {};
  },
  methods: {
    docUpdateEvent() {
      addListener("update", () => {
        const block = superDoc
          .getBlocks()
          .find((block) => block.id === this.$superConfig.blockId);
        const dom = this.$refs["super-paragraph"];
        if (block && dom.innerHTML !== block.data.text) {
          const select = window.getSelection();
          const preRange = select.getRangeAt(0);
          select.removeAllRanges();

          const _template = document.createElement("div");
          _template.innerHTML = markdownSyntaxTransform(block.data.text);

          syncDom(dom, _template);
          select.addRange(preRange);
        }
      });
    },
    contentChange(event) {
      if (!event.target.childNodes) return;
      this.quickTransform(event);
      /**
       * 更新data后续改成sdk提供的方法
       */
      const block = superDoc
        .getBlocks()
        .find((block) => block.id === this.$superConfig.blockId);
      block.data.text = markdownSyntaxTransform(event.target.innerHTML);
      // block.data.text = event.target.innerHTML;
    },
    /**
     * 各种类型的快捷转换
     * 目前统一在段落实现
     * 后续换成各个模块负责
    */
    quickTransform(event) {
      const content = event.target.innerText;
      if (content === "/") {
        showCommand();
      }
    }
  },
  mounted() {
    this.docUpdateEvent();
  },
};
</script>

<style scoped>
.super-block:focus:empty::before {
  content: attr(placeholder);
  display: block;
  color: #c4c4c4;
  font-weight: 400;
}

#superdoc-inter-p {
  min-height: 22px;
}
</style>
