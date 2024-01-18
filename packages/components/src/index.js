/**
 * block plugins
 */
import Paragraph from "./plugins/blocks/paragraph.js";
import AI from "./plugins/blocks/ai.js";
import Head from "./plugins/blocks/head.js";
import ImageDoc from "./plugins/blocks/image.js";
import TableDoc from "./plugins/blocks/table.js";
import ListDoc from "./plugins/blocks/list.js";
import TodoList from "./plugins/blocks/todoList.js";
import Auae from "./plugins/blocks/auae.js";

/**
 * tools plugins
 */
import { ParagraphTool } from "./plugins/tools/paragraph";
import { AITool } from "./plugins/tools/ai.js";
import {
  HeadTool1,
  HeadTool2,
  HeadTool3,
  HeadTool4,
} from "./plugins/tools/head.js";
import ImageTool from "./plugins/tools/image.js";
import TableTool from "./plugins/tools/table.js";
import ListTool from "./plugins/tools/list.js";
import TodoListTool from './plugins/tools/todoList.js';
import AuaeTool from './plugins/tools/auae.js';

/**
 * tools layout
 */
import deleteTool from "./plugins/layout/deleteTool.js";
import moveDownTool from "./plugins/layout/moveDownTool.js";
import moveUpTool from "./plugins/layout/moveUpTool.js";

/**
 * menu
 */
import bold from "./menu/bold.js";
import italic from "./menu/italic.js";

export default {
  blocks: {
    Paragraph,
    AI,
    Head,
    ImageDoc,
    TableDoc,
    ListDoc,
    TodoList,
    Auae
  },
  tools: {
    plugins: [
      AITool,
      ParagraphTool,
      HeadTool1,
      HeadTool2,
      HeadTool3,
      HeadTool4,
      ImageTool,
      TableTool,
      ListTool,
      TodoListTool,
      AuaeTool
    ],
    layout: [moveUpTool, deleteTool, moveDownTool],
  },
  menu: [bold, italic],
};
