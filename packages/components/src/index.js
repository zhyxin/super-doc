/**
 * block plugins
 */
import Paragraph from "./plugins/blocks/paragraph.js";
import AI from "./plugins/blocks/ai.js";
import Head from "./plugins/blocks/head.js";

/**
 * tools
 */
import { ParagraphTool } from "./plugins/tools/paragraph";
import { AITool } from "./plugins/tools/ai.js";
import {
  HeadTool1,
  HeadTool2,
  HeadTool3,
  HeadTool4,
  HeadTool5,
  HeadTool6,
} from "./plugins/tools/head.js";
export default {
  blocks: {
    Paragraph,
    AI,
    Head,
  },
  tools: {
    AITool,
    ParagraphTool,
    HeadTool1,
    HeadTool2,
    HeadTool3,
    HeadTool4,
    HeadTool5,
    HeadTool6,
  },
};
