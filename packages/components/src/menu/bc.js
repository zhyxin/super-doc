import { Dom as $ } from '@super-doc/share';
export default class BC {

    getIcon() {
        const span = document.createElement('span');
        span.textContent = 'BC';
        return span;
    }

    /**
     * 
    */
    action(selectData, target) {
        return 
    }

    selectColor() {
        const container = $.make('div', ['super-bc-color-container'], {});
    }
}