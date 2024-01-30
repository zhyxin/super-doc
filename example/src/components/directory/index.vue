<template>
  <div>
    <div class="super-hover" v-show="!showDirectory" @click="toggleDirectory">
      目录
    </div>
    <div class="super-directory" v-show="showDirectory">
      <p class="super-directory-title">
        目录
        <i class="el-icon-close" @click="toggleDirectory"></i>
      </p>
      <p
        v-for="item in blockData"
        :key="item.id"
        :class="['super-directory-item', classMap[item.data.level]]"
        :directory-id="item.id"
        @click="scrollInto(item)"
      >
        {{ item.data.text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    blockData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      showDirectory: false,
      classMap: {
        h1: "super-directory-h1",
        h2: "super-directory-h2",
        h3: "super-directory-h3",
        h4: "super-directory-h4",
        h5: "super-directory-h5",
        h6: "super-directory-h6",
      },
    };
  },
  watch: {
    blockData: {
      handler: function (newVal, oldVal) {
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    // 添加目录 ---旧版添加目录方式
    addDirectory() {
      let directoryList = [];
      let includesNode = ["H1", "H2", "H3", "H4", "H5"];
      let classMap = {
        H1: "super-directory-h1",
        H2: "super-directory-h2",
        H3: "super-directory-h3",
        H4: "super-directory-h4",
        H5: "super-directory-h5",
      };
      let directoryString = ``;
      $(".super-doc-editor__redactor .super-doc-block").each(function (
        index,
        block
      ) {
        let headData = $(block).children()?.children();
        if (headData && includesNode.includes(headData[0].nodeName)) {
          let nodeName = headData[0].nodeName;
          let object = {
            id: headData.attr("block-id"),
            nodeName,
            text: headData.text(),
            el: headData,
          };
          directoryString += `<p class="super-directory-item ${classMap[nodeName]}" block-id=${object.id} >${object.text}</p>`;
          directoryList.push(object);
        }
      });
      let superDirectory = $(
        `<div class="super-directory"><p class="super-directory-title">目录</p><div>`
      );
      //事件代理
      $(superDirectory).click((e) => {
        if (e.target) {
          let blockId = e.target.getAttribute("block-id");
          if (blockId) {
            let targetDom = directoryList.find((f) => f.id == blockId);
            targetDom &&
              targetDom.el[0].scrollIntoView({
                behavior: "smooth",
              });
          }
        }
      });
      $(superDirectory).append($(directoryString));
      $("#editorjs").append(superDirectory);
    },
    toggleDirectory() {
      this.showDirectory = !this.showDirectory;
    },
    scrollInto(item) {
      let blockId = item.id;
      if (blockId) {
        let targetDom = document.querySelector(`[block-id="${blockId}"]`);
        targetDom &&
          targetDom.scrollIntoView({
            behavior: "smooth",
          });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.super-hover {
  width: 50px;
  height: 50px;
  z-index: 2;
  position: fixed;
  border-radius: 10px;
  line-height: 50px;
  right: 0;
  top: 20%;
  cursor: pointer;
  &:hover {
    background: rgb(245, 247, 250);
  }
}
.super-directory {
  width: 250px;
  z-index: 1;
  position: fixed;
  background: #fff;
  right: 0;
  top: 0;
  bottom: 0;
  // height: 100px;
  min-height: 100vh;
  height: 100%;
  // max-height: 50vh;
  margin: auto;
  overflow: auto;
  padding-top: 10px;
  padding-left: 15px;
  padding-bottom: 10px;
  border-radius: 10px;
  // box-shadow: 0px 3px 10px #bbbbbb;
  border-left: 1px solid var(--we_line_light_color, rgba(23, 26, 29, 0.08));
  .super-directory-title {
    margin: 5px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .super-directory-item {
    text-align: left;
    margin: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    font-weight: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      background: rgb(245, 247, 250);
    }
  }
  .super-directory-h1 {
    padding-left: 3px;
  }
  .super-directory-h2 {
    padding-left: 16px;
  }
  .super-directory-h3 {
    padding-left: 32px;
  }
  .super-directory-h4 {
    padding-left: 48px;
  }
  .super-directory-h5 {
    padding-left: 54px;
  }
  .super-directory-h6 {
    padding-left: 70px;
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
