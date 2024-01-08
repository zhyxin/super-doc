<template>
  <div class="superdoc-list-container">
    <span class="superdoc-list-icon">+</span>
    <div
      ref="superdoc-list-content"
      class="content"
      style="width: 100%"
      contenteditable
      placeholder="列表"
      @keydown="keydownHandler"
      @input.stop.self="contentChange"
    ></div>
    {{ lineData.id }}
  </div>
</template>

<script>
import { addListener, syncDom, markdownSyntaxTransform } from "@super-doc/api";
export default {
  props: ["lineData", "isFocus"],
  data() {
    return {};
  },
  methods: {
    keydownHandler(event) {
      if(event.keyCode === 13) {
        if(!this.lineData.text) return;
        event.preventDefault();
        event.stopPropagation();
        this.$emit('addItem', this.lineData.id);
      };
    },
    contentChange(event) {
      if (!event.target.childNodes) return;
      this.$emit('contentChange', { id: this.lineData.id, text: event.target.innerHTML });
    },
    init() {
      const _temp = document.createElement('div');
      _temp.innerHTML = this.lineData.text;
      syncDom(this.$refs['superdoc-list-content'], _temp);
      this.$nextTick(() => {
        if(this.isFocus) {
          this.$refs['superdoc-list-content'].focus();
        }
      }, 0)
    }
  },
  mounted() {
    this.init();
    console.log('新增的：', this.lineData);
    console.log('vue：', this);
  },
  watch: {
    'lineData.text': function (n) {
      // const _temp = document.createElement('div');
      // _temp.innerHTML = n;
      // syncDom(this.$refs['superdoc-list-content'], _temp);
    }
  }
};
</script>
<style>
.superdoc-list-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.superdoc-list-icon {
  font-weight: 600;
  margin-right: 10px;
}
.content {
  border: none;
  display: inline-block;
  width: 100%;
}
.content:focus:empty::before {
  content: attr(placeholder);
  display: block;
  color: #c4c4c4;
  font-weight: 400;
}
</style>
