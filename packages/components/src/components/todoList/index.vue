<template>
  <div class="todo-container">
    <TodoItem
      v-for="todo in list"
      :key="todo.id"
      :todo="todo"
      :focus="focusId === todo.id"
      @add="addHandler"
      @remove="removeHandler"
    ></TodoItem>
  </div>
</template>

<script>
import { getBlockData, generateId } from "@super-doc/api";
import TodoItem from "./todoItem.vue";
export default {
  data() {
    return {
      list: getBlockData(this.$attrs["block-id"]).data.list,
      blockId: this.$attrs["block-id"],
      focusId: ''
    };
  },
  components: {
    TodoItem,
  },
  methods: {
    initData() {
      this.list.forEach((item) => (item.id = generateId()));
    },
    addHandler(id) {
      const focusId = generateId();
      this.list.some((item, index) => {
        if (item.id === id) {
          this.list.splice(index + 1, 0, {
            task: "",
            id: focusId,
            finish: false,
          });
          return true;
        }
      });
      this.focusId = focusId;
    },
    removeHandler(id) {
      this.list.some((item, index) => {
        if (item.id === id) {
          this.list.splice(index, 1);
          return true;
        }
      });
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    console.log("待办列表====================：", this.list);
    alert(this.$attrs["block-id"])
  },
};
</script>

<style lang="less" scoped>
.todo-container {
}
</style>
