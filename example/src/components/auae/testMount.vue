<template>
  <div ref="ddd" style=height:400px></div>
</template>
<script>
import {
  getBlockData,
  generateId,
} from "../../../../packages/api/dist/api.umd";
import dddEditorSdk from "@auae/dddeditor";
const { Activator, dddEditor, kanban, input } = dddEditorSdk;

console.log(dddEditorSdk, "element>>>", dddEditorSdk);
const EDITOR_NAME = "stormEditor";

// 故事地图默认渲染节点
const BASE_NODE = {
  name: "name-OLZpxtcj",
  desp: "模版",
  size: {
    width: 1000,
    height: 800,
  },
  events: [],
  flowContent: {
    nodes: [
      {
        label: "DOM节点",
        nodeType: "fakeNode",
        is: EDITOR_NAME,
        nodeStatusRegular: {
          normal: {
            borderColor: "#fff",
            backgroundColor: "transparent",
          },
        },
        bounds: { x: 10, y: 87, width: 600, height: 300 },
      },
    ],
    edges: [],
    groups: [],
    legends: [],
  },
  layout: {
    name: "",
    params: {},
  },
};
export default {
  components: {},
  data() {
    return {
      templateData: null,
      editorActivator:null,
      editorOption: {
        hiddenTopToolBar: true, // 是否隐藏顶部栏
        hiddenRightViewPart: false, // 是否开启右侧边栏
        // useDomRender: true,
        // defaultLockStatus: false,
      },
      storyMapData: null,
    };
  },
  auaeEditor() {
    return this.$refs.editor;
  },
  methods: {
    init() {
      const _data = getBlockData(this.$attrs["block-id"]).data;
      let type = _data.mapType;
      try {
        if (type == "userStory") {
          this.editorOption.useDomRender = true;
          this.editorOption.defaultLockStatus = false;
          this.templateData = BASE_NODE;
          if (_data.mapData) {
            _data.mapData.id = generateId();
            this.storyMapData = [
              {
                component: "stormEditor",
                mapData: JSON.parse(JSON.stringify(_data.mapData)),
              },
            ];
          }
          console.log(this.storyMapData, "storyMapData数据", this.$refs.ddd);
        } else {
          // _data.mapData.id = generateId();
          console.log(_data.mapData, "_data.mapData");
          this.templateData = JSON.parse(JSON.stringify(_data.mapData));
        }
      } catch (e) {
        console.log(e, "初始化出错", _data.mapData);
      }
    },
    mountDDDeditor() {
      let dddComponent = Vue.extend(dddEditor);
      let vm = new dddComponent({
        ref: "editor",
        propsData: {
          options: this.editorOption,
          activator: this.editorActivator,
          templateData: this.templateData,
          storyMapData: this.storyMapData,
        },
      });
      vm.$mount(this.$refs.ddd);
    },
  },
  created() {
      this.editorActivator = new Activator();
      console.log('进入了')
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
        this.mountDDDeditor();
    });
  },
};
</script>

<style scoped lang="less"></style>
