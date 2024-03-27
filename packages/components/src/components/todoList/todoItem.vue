<template>
  <div class="super-doc-todo-option-container" :parent-id="blockId" :task-id="todo.id" :class="[foucsFlag?'foucs-style':'']" @keydown="enterKeydownHandler">
    <el-checkbox class="icon" size="small" v-model="todo.finish"></el-checkbox>
    <SuperDocInput
      style="width: calc(650px - 24px);"
      ref="superDocInput"
      :class="{finish: todo.finish}"
      :contenteditable="!todo.finish"
      :content="todo.task"
      @contentChange="contentChange"
      @focusChange="focusChange"
    />
  </div>
</template>

<script>
import SuperDocInput from "../../common/input.vue";
export default {
  props: ["todo", "focus", "blockId"],
  data() {
    return {
      foucsFlag:false,
    };
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
    focusChange(flag){
      this.foucsFlag = flag
    }
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
    border-left: 4px solid transparent;
    border-radius: 4px;
    padding: 2px 2px 2px 0;
    transform: translateX(-4px);
    transition: background-color .1s ease-in;
    width: 100%;
   
  > .icon {
    margin-right: 10px;
  }
  .finish {
    color: #ccc;
  }
  &:hover{
    background-color: var(--we_overlay_light_color, rgba(23, 26, 29, 0.06))
  }
}
// foucs 监听
  .foucs-style{
    background-color: var(--we_overlay_light_color, rgba(23, 26, 29, 0.06)) 
  }
</style>
