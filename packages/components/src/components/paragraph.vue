<template>
  <SuperDocInput
    ref="superDocInput"
    contenteditable="true"
    :content="content.text"
    @contentChange="contentChange"
    style="margin: 8px 0;padding:0 0; line-height: 1.7;"
    class="super-input"
  ></SuperDocInput>
</template>

<script>
/**
 * 组件需要把数据同步回去的方案一：
 *
 * API提供更新json的方法，插件调用该方法去更新指定blockID的数据
 *
 */
import { getBlockData } from "@super-doc/api";
import SuperDocInput from "../common/input.vue";
export default {
  props: ["$superConfig"],
  data() {
    return {
      content: getBlockData(this.$attrs["block-id"]).data,
      blockId: this.$attrs["block-id"],
    };
  },
  components: {
    SuperDocInput,
  },
  methods: {
    contentChange({content, id}) {
      this.content.text = content;
    },
  },
  mounted() {
  },
  watch: {
    "content.text"(n) {
      const _temp = document.createElement("div");
      _temp.innerHTML = n;
      this.$refs["superDocInput"].syncDom(_temp);
    },
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
.super-input{
  color: rgb(37, 39, 42);
  font-size: 11pt;
    font-family: "zh quote", "Helvetica Neue", -apple-system, "PingFang SC", "Microsoft YaHei", STHeiti, Helvetica, Arial, sans-serif, "Apple Color Emoji";
}

#superdoc-paragraph {
  min-height: 22px;
}
</style>
