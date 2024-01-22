import { EditorModules } from "@super-doc/types";

export const setModules = (moduleInstances: EditorModules) => {
    window['__SUPERDOC__'] = moduleInstances;
}

export const getModules = ():EditorModules => {
    return window['__SUPERDOC__'];
};