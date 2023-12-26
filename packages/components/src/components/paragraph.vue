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
import { showCommand, addListener, syncDom } from "@super-doc/api";
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
          _template.innerHTML = block.data.text;

          syncDom(dom, _template);
          // dom.innerHTML = block.data.text;
          select.addRange(preRange);
        }
      });
    },
    contentChange(event) {
      if (!event.target.childNodes) return;
      const content = event.target.innerText;
      if (content === "/") {
        showCommand();
      } else {
        /**
         * 更新data后续改成sdk提供的方法
         */
        const block = superDoc
          .getBlocks()
          .find((block) => block.id === this.$superConfig.blockId);
        block.data.text = event.target.innerHTML;
      }
    },
  },
  mounted() {
    this.docUpdateEvent();
  },
};
</script>

<style scoped>
/* TODO：后续看看是否需要改成js实现    block 占位符 */
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
