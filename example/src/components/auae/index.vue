<template>
  <div>
    <ddd-editor
      ref="editor"
      :options="editorOption"
      :activator="editorActivator"
      :templateData="templateData"
      :storyMapData="storyMapData"
      @after_changeHistory="changeHistory"
      @mapChange="storyMapChange"
      @after_editor_init="afterInit"
      style="height: 500px;margin-bottom:10px"
      class="ddd-editor-style"
    ></ddd-editor>
  </div>
</template>

<script>
// import { getBlockData } from "@super-doc/api";
import {
  getBlockData,
  generateId,
} from "../../../../packages/api/dist/api.umd";

import dddEditorSdk from "@auae/dddeditor";
import storyData from "../../libs/storyData.json";
const { Activator, dddEditor, kanban, input } = dddEditorSdk;
const editorActivator = new Activator();
console.log(dddEditorSdk, "element>>>", dddEditorSdk);
const EDITOR_NAME = "stormEditor";

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
  components: {
    "ddd-editor": dddEditor,
  },
  data() {
    return {
      editorActivator: editorActivator,
      templateData: null,
      editorOption: {
        hiddenTopToolBar: true, // 是否隐藏顶部栏
        hiddenRightViewPart: false, // 是否开启右侧边栏
        // useDomRender: true,
        // defaultLockStatus: false,
      },
      storyMapData: null,
      blockData:null,
    };
  },
  computed: {
    dddEditor() {
      return this.$refs.editor;
    },
  },
  methods: {
    afterInit(){
        const editorStore = this.dddEditor.auaeEditor.$auaeStore;
        const instance = editorStore.getters.domNodes[EDITOR_NAME];
        if (instance) {
            instance.offsetX = 0
        }
    },
    init() {
      const _data = getBlockData(this.$attrs["block-id"]).data;
      let type = _data.mapType || "userStory";
      try {
        if (type == "userStory") {
          this.editorOption.useDomRender = true;
          this.editorOption.defaultLockStatus = false;
          this.templateData = JSON.parse(JSON.stringify(BASE_NODE));
          if (_data.mapData) {
            _data.mapData.id = generateId();
          }else {
            _data.mapData = storyData
          }
            this.storyMapData = [
                {
                component: EDITOR_NAME,
                mapData: JSON.parse(JSON.stringify(_data.mapData)),
                },
            ];
           
          console.log(this.storyMapData, "storyMapData数据", this.$refs.editor);
        } else {
          console.log(_data.mapData, "_data.mapData");
          this.templateData = JSON.parse(JSON.stringify(_data.mapData));
        }
      } catch (e) {
        console.log(e, "初始化出错", _data.mapData);
      }
    },
    changeHistory(history){
        console.log(history,'其他图的移动更新')
    },
    storyMapChange({command,is}){
        // console.log('mapcahnge')
        const editorStore = this.dddEditor.auaeEditor.$auaeStore;
        const instance = editorStore.getters.domNodes[is];
        if (instance) {
            let blockData  = getBlockData(this.$attrs["block-id"]).data;
            blockData.mapData = instance.userStoryMap
            console.log(instance.userStoryMap , "用户故事地图数据更新",blockData);
        }
    }
  },
  created() {
    // this.init()
  },
  mounted() {
    this.$nextTick(() => {
        this.init();

    });
  },
};
</script>

<style scoped lang="less">
.ddd-editor-style {
  ::v-deep {
    .task-column {
      > span {
        min-height: 0 !important;
      }
    }
    .task-container{
        margin-top: 0px !important;
    }
  }
}
</style>
