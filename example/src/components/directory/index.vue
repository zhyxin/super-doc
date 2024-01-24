<template>
  <div class="super-doc-directory">
    <el-tree
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>
<style lang="less" scoped>
.super-doc-directory {
  width: 150px;
  z-index: 1000;
  position: fixed;
  background: #fcf8f8;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  // height: 100px;
  max-height: 50vh;
  margin: auto;
  overflow: auto;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  .super-directory-item {
    margin: 6px 15px;
    text-align: left;
    font-weight: normal;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa; /* 设置滑块背景色 */
    border-radius: 4px; /* 设置滑块圆角 */
  }
}
</style>
