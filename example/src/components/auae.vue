<template>
    <div class="hello" :class="{'is-full-screen': isFullScreen}">
     <core  ref="editor" :activator="editorActivator" :options="options" :showFullScreenIcon="showFullScreenIcon" :readOnly="readOnly" @changeFlowContent="changeFlowContent" @toggleFullScreen="toggleFullScreen"></core>
    </div>
  </template>
  
  <script>
  import auaeSDK from "@auae/core";
  import "@auae/core/assets";
  import register from "../utils/register.js";
  const editorActivator = register(auaeSDK); 
 import {uml} from "../utils/uml.js"
  
  export default {
    name: "Auae",
    props: {
      msg: String,
      readOnly: {
        type: Boolean,
        default: false
      },
      pageDef: {
        type: Object,
        default: () => {}
      },
      showFullScreenIcon: {
        type: Boolean,
        default:false
      },
    },
    components: {
      core:auaeSDK.Editor
    },
    data() {
      return {
        isFullScreen: false,
        options:{
            //topToolbar 显示隐藏配置化
            
            //是否启用dom层渲染器
            useDomRender:false,
            defaultLockStatus:true,
            //禁用右侧默认配置面板
            hiddenRightViewPart:false
        },
        editorActivator:editorActivator
      }
    },
    mounted(){
     this.$refs.editor.init(uml);
    },
    methods: {
      toggleFullScreen() {
        this.isFullScreen = !this.isFullScreen
      },
      changeFlowContent(content){
        this.$emit('changeFlowContent', content)
      }
    },
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .is-full-screen{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3000;
  }
  </style>
  