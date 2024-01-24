<template>
  <div>
    <ddd-editor
      ref="editor"
      :options="storyOption"
      :activator="editorActivator"
      :templateData="templateData"
      :storyMapData="storyMapData"
      style="height: 500px"
    ></ddd-editor>
    <ddd-editor
      ref="editor2"
      :options="storyOption"
      :activator="editorActivator"
      :templateData="templateData"
      :storyMapData="storyMapData"
      style="height: 500px"
    ></ddd-editor>
    <ddd-editor
      ref="editor4"
      :options="editorOption"
      :activator="editorActivator"
      :templateData="divideTemplateData"
      :storyMapData="storyMapData"
      style="height: 500px"
    ></ddd-editor>
    <ddd-editor
      ref="editor5"
      :options="editorOption"
      :activator="editorActivator"
      :templateData="subTemplateData"
      style="height: 500px"
    ></ddd-editor>
    <ddd-editor
      ref="editor6"
      :options="editorOption"
      :activator="editorActivator"
      :templateData="umlTemplateData"
      style="height: 500px"
    ></ddd-editor>
  </div>
</template>

<script>
import dddEditorSdk from "@auae/dddeditor";
import divideJson from "../../libs/divide.json";
import subDomain from "../../libs/subDomain.json";
import storyData from "../../libs/storyData.json";
import uml from "../../libs/uml.json";
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
      storyOption: {
        hiddenTopToolBar: true, // 是否隐藏顶部栏
        hiddenRightViewPart: false, // 是否开启右侧边栏
      },
      divideTemplateData: divideJson,
      subTemplateData: subDomain,
      umlTemplateData: uml,
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
          console.log(this.storyMapData, "storyMapData数据", this.$refs.editor);
        } else {
          // _data.mapData.id = generateId();
          console.log(_data.mapData, "_data.mapData");
          this.templateData = JSON.parse(JSON.stringify(_data.mapData));
        }
      } catch (e) {
        console.log(e, "初始化出错", _data.mapData);
      }
    },
    initStoryData() {
      this.templateData = BASE_NODE;
      this.storyOption.useDomRender = true;
      this.storyOption.defaultLockStatus = false;
      this.storyMapData = [
        {
          component: "stormEditor",
          mapData: JSON.parse(JSON.stringify(storyData)),
        },
      ];
    },
  },
  beforeCreate() {},
  mounted() {
    this.$nextTick(() => {
      // this.init();
      this.initStoryData();
    });
  },
};
</script>

<style scoped></style>
