<template>
  <div>
    <div class="super-hover" v-show="!showDirectory" @click="toggleDirectory">
      大纲
    </div>
    <div class="super-directory" v-show="showDirectory">
      <p class="super-directory-title">
        大纲
        <i class="el-icon-close" @click="toggleDirectory"></i>
      </p>
      <div
        v-for="item in blockData"
        :key="item.id"
        :class="['super-directory-item', classMap[item.data.level]]"
        :directory-id="item.id"
        @click="scrollInto(item)"
      >
        <i style="color: #818c92;" :class="[collapse(item)]" @click.stop="collapseDirectory(item)"></i>
        <p>{{ item.data.text }}</p>
      </div>
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
      // 折叠标题map集合
      collapseMap: {},
    };
  },
  watch: {
    blockData: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          if (
            JSON.stringify(this.collapseMap) == "{}" ||
            (oldVal && newVal.length !== oldVal.length)
          ) {
            newVal.reduce((obj, item, index) => {
              const { id } = item;
              if (!obj[id]) {
                // collapse -----  0:不折叠 1:折叠  2:无子节点
                this.$set(obj, id, { collapse: 0, children: [] });
              }
              return this.relatedChildren(obj, item, index);
            }, this.collapseMap);
            console.log(this.collapseMap, "map");
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    collapse() {
      return (item) => {
        const { id } = item;
        // if (!this.collapse[id]) return "";
        let { collapse } = this.collapseMap[id];
        if (collapse == 0) return "el-icon-caret-bottom";
        if (collapse == 1) return "el-icon-caret-right";
        if (collapse == 2) return "";
      };
    },
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
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
    getDomById(id) {
      return document.querySelector(`${id}`);
    },
    scrollInto(item) {
      let blockId = item.id;
      if (blockId) {
        let targetDom = this.getDomById(`[block-id="${blockId}"]`);
        let directoryDom = this.getDomById(`[directory-id="${blockId}"]`);
        // TODO:上锁 ,不触发scroll事件
        if (targetDom) {
          this.locked = true;
          targetDom.scrollIntoView({
            behavior: "smooth",
          });
          this.setAnchorPosition(directoryDom);
          setTimeout(() => {
            this.locked = false;
          }, 1000);
        }
      }
    },
    // 折叠标题
    collapseDirectory(item) {
      const { id } = item;
      let { children, collapse } = this.collapseMap[id];
      if(children.length==0) return
      this.collapseMap[id].collapse = !collapse;
      children.forEach((child) => {
        let element = document.querySelector(`[directory-id="${child}"]`);
        if (!collapse) {
          element.classList.add("super-directory-display");
        } else {
          element.classList.remove("super-directory-display");
        }
        // console.log(element, child);
      });
    },
    // 关联子节点
    relatedChildren(obj, item, index) {
      const { id, data } = item;
      let sequence = ["h1", "h2", "h3", "h4", "h5", "h6"].reverse();
      let sliceList = this.blockData.slice(index + 1);
      let num = sequence.indexOf(data.level);
      sliceList.some((value) => {
        let childrenNum = sequence.indexOf(value.data.level);
        if (num > childrenNum) {
          obj[id].children.push(value.id);
        } else {
          return true;
        }
      });
      if (obj[id].children.length == 0) obj[id].collapse = 2;
      return obj;
    },
    isElementVisible(el, pHeight) {
      const rect = el.getBoundingClientRect();
      const vHeight = pHeight || el.parentElement.offsetHeight;
      if (rect.bottom < 0 || rect.top > vHeight) {
        return false;
      }

      return true;
    },
    scrollListener(e) {
      let minOffset = 60;
      let self = this;
      if (this.locked) return;
      $(".super-doc-editor__redactor .super-doc-block").each(function (
        i,
        block
      ) {
        let blockElement = $(block).children()?.children();
        var Top = $(blockElement).offset().top; //元素距离顶部距离
        var scroll = $(document).scrollTop(); //滚动高度
        let offset = Math.abs(Top - scroll);
        if (offset >= 0 && offset <= minOffset) {
          minOffset = offset;
          let blockId = $(blockElement).attr("block-id");
          let directoryEle = self.getDomById(`[directory-id="${blockId}"]`);
          if (directoryEle) {
            let visible = self.isElementVisible(directoryEle);
            if (!visible) {
              directoryEle.scrollIntoView();
            }
            self.setAnchorPosition(directoryEle);
          }
        }
      });
    },
    setAnchorPosition(el) {
      $(el).siblings().removeClass("super-directory-left-line");
      $(el).addClass("super-directory-left-line");
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollListener);
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
  text-align: center;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  &:hover {
    background: rgb(245, 247, 250);
  }
}
.super-directory {
  width: 268px;
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
  padding-bottom: 10px;
  // border-radius: 10px;
  // border-left: 1px solid var(--we_line_light_color, rgba(23, 26, 29, 0.08));
  border: none;
  &::after {
    content: '';
    position: fixed;
    right: 264px;
    top: 50%;
    width: 1px;
    height: calc(100vh - 50px);
    background: #e8ecef;
    z-index: -1;
    transform: translateY(-50%);
  }
  .super-directory-title {
    margin: 5px 5px 5px 41px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .super-directory-anchor {
    position: absolute;
    width: 100px;
    height: 100px;
    background: yellow;
  }
  .super-directory-item {
    text-align: left;
    margin: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    // border-left: 2px solid transparent;
    font-weight: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    > i {
      width: 16px;
      height: 16px;
    }
    > p {
      margin: 0 0 0 4px;
    }
    &:hover {
      background: rgb(245, 247, 250);
    }
  }
  .super-directory-h1 {
    padding-left: 20px;
  }
  .super-directory-h2 {
    padding-left: 34px;
  }
  .super-directory-h3 {
    padding-left: 50px;
  }
  .super-directory-h4 {
    padding-left: 66px;
  }
  .super-directory-h5 {
    padding-left: 72px;
  }
  .super-directory-h6 {
    padding-left: 88px;
  }
  .super-directory-display {
    display: none;
  }
  .super-directory-left-line {
    transition: all 0.2s ease-in-out;
    // border-left: 2px solid #1edae1;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      width: 8px;
      height: 8px;
      /* height: 100%; */
      background: #57b0bd;
      left: 0px;
      border-radius: 50%;
    }
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
