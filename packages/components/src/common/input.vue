<template>
  <p
    ref="super-paragraph"
    id="superdoc-paragraph"
    class="super-block"
    :contenteditable="contenteditable"
    placeholder='"/"插入内容'
    @input.stop.self="contentChange"
    style="margin: 0;"
  ></p>
</template>
<script>
import { showCommand, syncDom, markdownSyntaxTransform } from "@super-doc/api";

export default {
  props: ["content", "contenteditable"],
  data() {
    return {};
  },
  methods: {
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
    },
    contentChange(event) {
      if (!event.target.childNodes) return;
      this.quickTransform(event);
      this.$emit('contentChange', markdownSyntaxTransform(event.target.innerHTML));
    },
    syncDom(newDom) {
      syncDom(this.$refs['super-paragraph'], newDom);
    }
  },
};
</script>

<style lang="less" scoped>
.super-block:focus:empty::before {
  content: attr(placeholder);
  display: block;
  color: #c4c4c4;
  font-weight: 400;
}

#superdoc-paragraph {
  min-height: 22px;
}
</style>
