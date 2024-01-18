<template>
  <div class="super-doc-todo-option-container" @keydown="enterKeydownHandler">
    <el-checkbox class="icon" size="small" v-model="todo.finish"></el-checkbox>
    <SuperDocInput
      style="width: calc(650px - 24px);"
      ref="superDocInput"
      :class="{finish: todo.finish}"
      :contenteditable="!todo.finish"
      :content="todo.task"
      @contentChange="contentChange"
    />
  </div>
</template>

<script>
import SuperDocInput from "../../common/input.vue";
export default {
  props: ["todo", "focus"],
  data() {
    return {};
  },
  components: {
    SuperDocInput,
  },
  methods: {
    init() {
      if(this.focus) {
        this.$refs['superDocInput'].$refs['super-paragraph'].focus();
      } 
    },
    contentChange({content, id}) {
      /**
       * 更新data后续改成sdk提供的方法
       */
      console.log("-----", this.todo);  
      this.todo.task = content;
    },
    enterKeydownHandler(event) {
      if (event.keyCode === 13 && this.todo.task) {
        event.preventDefault();
        event.stopPropagation();
        this.$emit("add", this.todo.id);
      } else if (event.keyCode === 13 && !this.todo.task) {
        this.$emit("remove", this.todo.id);
      }
    },
  },
  mounted() {
    this.init();
    console.log("新增的任务：", this.todo);
  },
  watch: {
    "todo.task"(n) {
      const _temp = document.createElement("div");
      _temp.innerHTML = n;
      this.$refs["superDocInput"].syncDom(_temp);
    },
  },
};
</script>

<style scoped lang="less">
.super-doc-todo-option-container {
  display: flex;
  align-items: baseline;
  > .icon {
    margin-right: 10px;
  }
  .finish {
    color: #ccc;
  }
}
</style>
