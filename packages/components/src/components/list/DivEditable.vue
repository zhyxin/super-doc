<template>
  <div class="super-list-container">
    <div class="super-list-icon" >{{ type }}</div>
    <div
      contenteditable
      ref="list-content"
      class="super-list-content"
      style="width: 100%; min-height: 22px"
      :id="listData.id"
      :key="listData.id"
      @keydown="keydownHandler"
      @input.stop.self="contentChange"
    ></div>
  </div>
</template>

<script>
import {
  syncDom,
} from "@super-doc/api";

export default {
  props: ['listData', 'isFocus', 'type'],
  methods: {
    keydownHandler(event) {
      if (event.keyCode === 13 && this.listData.text) {
        event.preventDefault();
        event.stopPropagation();
        this.$emit('addHandler', this.listData.id);
      } else if(event.keyCode === 13 && !this.listData.text) {
        this.$emit('remove', this.listData.id);
      }
    },
    init() {
      const _div = document.createElement('div');
      _div.innerHTML = this.listData.text;
      syncDom(this.$refs['list-content'], _div);

      if(this.isFocus) {
        this.$refs['list-content'].focus(); 
      }
    },
    contentChange(content) {
      this.$emit("updateContent", {id: this.listData.id, content: event.target.innerHTML});
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.super-list-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  > .super-list-icon {
    margin-right: 10px;
    font-weight: 600;
  }
}
</style>
