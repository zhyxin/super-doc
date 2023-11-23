<template>
    <div @keydown.self.stop.prevent="(e) => {}">
      <vue-editor
        v-model="mdValue"
        @change="changeHandler"
        :uploadAction="uploadAction"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "App",
    data() {
      return {
        mdValue: "[[toc]]\n\n# 快速开始\n\n## 环境准备\n\n首先得有 node，并确保 node 版本是 14.18 或 16 以上。然后安装脚手架就可以体验了！\n\n[安装ufe脚手架](http://192.9.200.187:53201/ufe-cli)\n\n[在线案例](http://192.9.200.187:53207/examples)\n\n[在线案例的源码](http://192.168.180.150:8080/gerrit/admin/repos/ufe/micro-examples)\n\n## 视频教程\n[脚手架使用介绍](https://arm2.awebide.com/#/knowledge/video/904)\n\n[微前端使用介绍](https://arm2.awebide.com/#/knowledge/video/906)\n\n[微前端应用构建演示](https://arm2.awebide.com/#/knowledge/video/909)\n\n[可插拔使用介绍](https://arm2.awebide.com/#/knowledge/video/905)\n\n[前端物料规范和脚手架使用培训](https://arm2.awebide.com/#/knowledge/video/902)\n\n# 基础\n\n## 介绍\n\n物料即组成一个前端项目的不同单位，根据提供的功能不同，我们将可开发的基础物料分为三种类型，分别是：SDK、组件（component）和 区块（block）。\n\n## 基础物料规范说明\n\n**物料主要差异总览**\n| | SDK | 组件 | 区块 |\n| ---- | ---- | ---- | ---- |\n| 源码发布 | ❌ | ❌ | ✅ |\n| 可独立运行 | ❌ | ❌ | ❌ |\n| UI画面 | ❌(原则) | ✅ | ✅(原则) |\n| 业务逻辑 | ❌(原则) | ❌(原则) | ✅ |\n| 颗粒度 | 不限 | 不限 | 不限 |\n\n**物料分类模块图如下：**\n\n![流程图](./images/appDevGuide/materiel.png)\n\n**SDK:**\n\nSDK是高度抽象出的一些通用工具类或者公共方法，是一种为特定平台或应用而设计的软件开发工具包，旨在提供一些通用的工具、库、示例代码和文档等，帮助开发者更加高效、便捷地开发应用程序。在前端开发中，常见的请求API封装、状态管理、埋点、全局异常处理等都属于SDK。\n\n> 在之前的[前端公共基础模块开发规范1.0.1](https://arm2.awebide.com/#/resourceManager/docManager?manualId=104&share=false&versionId=196&menuId=640)中所介绍过的`pipe`和`plugin`物料都属于这里所描述的SDK物料的范畴。\n\n**组件（component）：**\n\n组件是功能比较确定且可复用的一个npm包，组件的粒度同Vue中的组件：可以是一个简单的按钮、一个图标；也可以是一组基础组件的集合、一个页面。应用中使用组件只需引入对应的npm包即可，不用关心组件内部的代码实现，想要控制组件在不同情况下产生不同的效果只能通过组件暴露出来的props去控制。目前组件对基础组件和业务组件的区分暂时不做限定。\n\n**区块（block）：**\n\n区块是相比组件最大的区别是以源码的方式提供，形式上一般由一个或多个页面组成。在使用时，消费者使用组件通常是去组件文档上复制demo来使用；而使用区块会将整个区块的源代码拷贝到应用中使用(拷贝的过程之后脚手架应该提供拷贝到指定目录的能力)，且应用里可以对区块的代码进行任意改动，因此后续区块的升级也不会对应用有任何影响。当你想要提供一个或多个页面并且可以提供源码的时候，推荐使用区块，如不可以提供源码在此情况下只能选择组件。\n\n> **上述的所有物料类型均可以通过[脚手架](/ufe-cli)直接创建出来，开发者可以根据实际需求，选择对应类型的物料进行开发。同时，为了方便各个物料之间互相依赖调用，提供了多包管理的目录结构，这里使用[lerna](https://lerna.js.org/)来管理。**\n\n## Monorepo说明\n\n使用[脚手架](/ufe-cli)创建过程中会提供是否使用多包管理的选项，通过命令行创建可能是下面的选项：\n\n![prompt-monorepo](./images/appDevGuide/prompt-monorepo.png)\n\n输入内容后即可创建出多包管理的目录结构。通过UI创建是在如下位置：\n\n![ui-monorepo](./images/appDevGuide/ui-monorepo.png)\n\n选择“初始化工作空间”，输入工作空间名，即可创建多包管理目录结构。\n\n**多包管理目录结构**\n\n`test-workspace`是工作空间名，创建的物料，如：`app1`和`block1`会自动生成到`packages`下对应类型的文件夹中。\n\n![monorepo-files](./images/appDevGuide/monorepo-files.png)\n\n如果需要在已有的多包管理目录下创建物料，可以**无需选择**工作空间，直接会识别到当前目录结构，自动创建在相应的目录下。\n\n**非多包管理目录结构**\n\n如果不想使用多包管理，会直接创建出对应的物料在当前目录下。\n\n![no-monorepo](./images/appDevGuide/no-monorepo.png)\n\n## 应用基础\n\n无论是否使用多包管理，都不影响创建物料工程的内容，只是生成的文件夹位置不同而已。\n\n同样是通过脚手架创建即可，普通应用的目录结构大致如下：\n\n![all-structor](./images/appDevGuide/all-structor.png)\n\n直接集成了`dev`和`build`命令。\n\n![package-scripts](./images/appDevGuide/package-scripts.png)\n\n### dev\n\n在工程目录下，运行如下命令，即可启动，进入调试模式，并且支持热更新：\n\n```sh\n$ npm run dev\n# OR\n$ yarn dev\n```\n\n启动成功后会显示本地地址，通过浏览器访问即可。\n\n### build\n\n在工程目录下，运行如下命令，即可将应用打包：\n",
        // mdValue: "# 1",
      };
    },
    components: {},
    methods: {
      changeHandler() {},
      uploadAction() {
        return new Promise((r) => {
          r(
            "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fba7d208b88049eebe1ac15be8f4250c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1730&s=604779&e=png&b=fefefe"
          );
        });
      },
    },
    mounted() {},
    watch: {
      mdValue() {
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  #app {
    height: 100%;
  }
  </style>
  