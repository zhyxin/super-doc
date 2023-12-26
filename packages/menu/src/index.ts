import {
    Module,
} from "@super-doc/share";
export default class Menu extends Module {
    private _visible: boolean = false;

    public menuInstanceMap: WeakMap<Menu, any> = new WeakMap();
    public set visible(val: boolean) {
        this.Editor.UI.menu.visible = val;
    }

    public prepare() {
        console.log('====', this);
        this.instanceMenu();
    }

    instanceMenu() {
        const { menu } = this.config.tools;
        menu.forEach(Menu => {
            const instance = new Menu();
            this.menuInstanceMap.set(Menu, instance);
        })
    }
}
