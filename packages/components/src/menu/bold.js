import { Dom as $ } from '@super-doc/share';
export default class Bold {

    getIcon() {
        const span = document.createElement('span');
        span.textContent = 'B';
        return span;
    }

    /**
     * 
    */
    action(selectData, target) {
        const b = $.make('b', ['super-doc-menu-bold'], {});
        b.innerText = selectData;
        return b;
    }

}