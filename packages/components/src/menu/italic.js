import { Dom as $ } from '@super-doc/share';
export default class Bold {

    getIcon() {
        const span = document.createElement('span');
        span.textContent = 'I';
        return span;
    }

    /**
     * 
    */
    action(selectData, target) {
        const i = $.make('i', ['super-doc-menu-italic'], {});
        i.innerText = selectData;
        return i;
    }

}