<template>
  <p
    ref="super-paragraph"
    id="superdoc-paragraph"
    class="super-block"
    :contenteditable="contenteditable"
    placeholder='"/"插入内容'
    @input.stop.self="contentChange"
    @focus.stop.self="$emit('focusChange',true)"
    @blur.stop.self="$emit('focusChange',false)"
    style="margin: 0;"
  ></p>
</template>
<script>
import { showCommand, syncDom, markdownSyntaxTransform, bindMenu } from "@super-doc/api";

export default {
  props: ["content", "contenteditable", "params"],
  data() {
    return {};
  },
  methods: {
    init() {
      const _temp = document.createElement('p');
      _temp.innerHTML = this.content;
      this.syncDom(_temp);

      bindMenu(this.$refs['super-paragraph']);
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
    },
    contentChange(event) {
      if (!event.target.childNodes) return;
      this.quickTransform(event);
      this.$emit('contentChange', {content: markdownSyntaxTransform(event.target.innerHTML), params: this.params});
    },
    syncDom(newDom) {
      syncDom(this.$refs['super-paragraph'], newDom);
    },
    focus() {
      this.$refs['super-paragraph'].focus();
    }
  },
  mounted() {
    this.init();
  }
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
