<template>
  <div class="paragraph-container">
    <h1 v-if="content.level === 'h1'">
      <SuperDocInput
        v-show="!showTranslate"
        ref="superDocInput"
        contenteditable="true"
        :content="content.text"
        @contentChange="contentChange"
        style="font-size: 32px;margin-top: 26px;margin-bottom:12px;padding:0;margin:0;font-weight: bold;line-height:1.45;"
        class="super-input"
      >
      </SuperDocInput>
    </h1>
    <h2 v-if="content.level === 'h2'">
      <SuperDocInput
        v-show="!showTranslate"
        ref="superDocInput"
        contenteditable="true"
        :content="content.text"
        @contentChange="contentChange"
        style="font-size: 25px;margin-top: 21px;margin-bottom:12px;padding:0;margin:0;font-weight: bold;line-height:1.45;"
        class="super-input"
      >
      </SuperDocInput>
    </h2>
    <h3 v-if="content.level === 'h3'">
      <SuperDocInput
        v-show="!showTranslate"
        ref="superDocInput"
        contenteditable="true"
        :content="content.text"
        @contentChange="contentChange"
        style="font-size: 18px;margin-top: 18px;margin-bottom:12px;padding:0;margin:0;font-weight: bold;line-height:1.45;"
        class="super-input"
      >
      </SuperDocInput>
    </h3>
    <h4 v-if="content.level === 'h4'">
      <SuperDocInput
        v-show="!showTranslate"
        ref="superDocInput"
        contenteditable="true"
        :content="content.text"
        @contentChange="contentChange"
        style="font-size: 16px;margin-top: 16px;margin-bottom:12px;padding:0;margin:0;font-weight: bold;line-height:1.45;"
        class="super-input"
      >
      </SuperDocInput>
    </h4>
    <h5 v-if="content.level === 'h5'">
      <SuperDocInput
        v-show="!showTranslate"
        ref="superDocInput"
        contenteditable="true"
        :content="content.text"
        @contentChange="contentChange"
        class="super-input"
      >
      </SuperDocInput>
    </h5>
    <div
      class="translate"
      ref="translate"
      v-if="content.translate"
    >
      <span>原：</span>{{ content ? content.translate : "" }}
      <el-divider></el-divider>
      <div style="text-align: right;">
        <el-button type="primary" size="mini" @click="restoreHandler">还原</el-button>
        <el-button size="mini" @click="closeHandler">关闭</el-button>
      </div>
    </div>
  </div>
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
import Paragraph from './paragraph.vue';
export default {
  props: ["$superConfig"],
  data() {
    return {
      blockData: getBlockData(this.$attrs["block-id"]),
      content: getBlockData(this.$attrs["block-id"]).data,
      blockId: this.$attrs["block-id"],
      showTranslate: false,
    };
  },
  components: {
    SuperDocInput,
    Paragraph
  },
  methods: {
    contentChange({ content, id }) {
      this.content.text = content;
    },
    keydownHandler(event) {
      if (event.keyCode === 91 && !!this.content.translate) {
        this.showTranslate = true;
        this.$nextTick(() => {
          this.$refs["translate"].focus();
        });
      }
    },
    keyupHandler(event) {
      if (event.keyCode === 91 && !!this.content.translate) {
        this.showTranslate = false;
        this.$nextTick(() => {
          this.$refs["superDocInput"].focus();
        });
      }
    },
    restoreHandler() {
      const _temp = this.content.translate;
      this.content.translate = '';
      this.content.text = _temp;
    },
    closeHandler() {
      this.content.translate = '';
    }
  },
  mounted() {
  },
  watch: {
    "content.text"(n) {
      const _temp = document.createElement("div");
      _temp.innerHTML = n;
      this.$refs["superDocInput"].syncDom(_temp);
    },
    "content.translate"(n) {
    },
  },
};
</script>

<style scoped lang="less">
.super-block:focus:empty::before {
  content: attr(placeholder);
  display: block;
  color: #c4c4c4;
  font-weight: 400;
}

.super-input {
  color: rgb(37, 39, 42);
  font-size: 11pt;
  font-family: "zh quote", "Helvetica Neue", -apple-system, "PingFang SC",
    "Microsoft YaHei", STHeiti, Helvetica, Arial, sans-serif,
    "Apple Color Emoji";
}

#superdoc-paragraph {
  min-height: 22px;
}
</style>
