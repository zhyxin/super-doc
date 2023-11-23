import { EditorModules } from "@super-doc/typing"
import { EditorConfig } from '@super-doc/types';

interface ModuleConfig {
    config: EditorConfig
}
export class Module {
    protected Editor: EditorModules;
    protected config: EditorConfig;
    public nodes: any = {} as any;
    public set state(Editor: EditorModules) {
        this.Editor = Editor;
    }

    constructor({ config }: ModuleConfig) {
        this.config = config;
    }
}