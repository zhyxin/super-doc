<template>
  <p
    id="superdoc-inter-p"
    ref="paragraph"
    class="super-block"
    contenteditable
    placeholder='"/"插入内容，或"command + /"唤起文档AI'
    @input="contentChange"
    style="padding: 8px 0;margin: 0;"
  >{{content}}</p>
</template>

<script>
/**
 * 组件需要把数据同步回去的方案一：
 *
 * API提供更新json的方法，插件调用该方法去更新指定blockID的数据
 *
 */
import { showCommand, addListener } from '@super-doc/api';
// this.config.Editor.UI.command.visible = true;
export default {
  data() {
    return {};
  },
  props: ["$superConfig"],
  methods: {
    contentChange(event) {
      const content = event.target.innerText;
      if(content === '/') {
        showCommand();
      }
      this.$superDocUpdateBlockData(this.$superConfig.blockId, {
        text: content,
      });
    },
  },
  computed: {
    // 返回非响应数据
    content: {
      get() {
        return this.$superConfig.blockData.text;
      },
      set(val) {
        this.$refs["paragraph"].textContent = val;
      },
    },
  },
  mounted() {
    // TODO: 这里要改
    addListener("update", (blocks) => {
      const block = blocks.find(
        (block) => block.id === this.$superConfig.blockId
      );
      block && (this.content = block.data.text);
    });
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
