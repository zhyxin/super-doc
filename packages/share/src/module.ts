import { EditorModules, EditorConfig, ModuleConfig } from "@super-doc/types"
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