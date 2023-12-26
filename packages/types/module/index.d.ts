/** . */
import BlockManager from '@super-doc/block-manager';
import UI from '@super-doc/ui';
import Renderer from '@super-doc/renderer';
import Event from '@super-doc/event';
import Menu from '@super-doc/menu';
import { EditorConfig } from '../configs/editor-config';
import { API } from '@super-doc/api';


export interface ModuleConfig {
    config: EditorConfig
}

export interface EditorModules {
    BlockManager: BlockManager,
    Renderer: Renderer,
    API: API,
    Menu: Menu,
    UI: UI,
    Event: Event,
}
