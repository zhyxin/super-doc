export function typeOf(object: any): string {
    return Object.prototype.toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

export function isObject(a: any): a is object {
    return typeOf(a) === 'object';
}

export function isFunction(fn: any): fn is (...args: any[]) => any {
    return typeOf(fn) === 'function' || typeOf(fn) === 'asyncfunction';
}

export function array(collection: ArrayLike<any>): any[] {
    return Array.prototype.slice.call(collection);
}
export function isArray (v) {
    return Array.isArray(v);
}
export function isEmpty(object: object): boolean {
    if (!object) {
        return true;
    }
    return Object.keys(object).length === 0 && object.constructor === Object;
}

export function generateBlockId(): string {
    const tempUrl = URL.createObjectURL(new Blob());
    const uuid = tempUrl.toString();
    URL.revokeObjectURL(tempUrl); // 释放这个url
    return uuid.substring(uuid.lastIndexOf("/") + 1)
}

export function deepMerge<T extends object>(target, ...sources): T {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }

                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

export function isString(v: any): boolean {
    return typeOf(v) === 'string';
}

export const isDOM = (v: any) => v instanceof HTMLElement;

export const deepFindBlockIdElement = (el: HTMLElement) => {
    if(el === null) return null;
    if(!!el.getAttribute('block-id')) {
        return el.getAttribute('block-id');
    } else {
        return deepFindBlockIdElement(el.parentElement);
    }
}

export const deepClone = function (object: Object | []) {
    try {
        const clone = JSON.parse(JSON.stringify(object));
        return clone;
    } catch (error) {
        console.error('深度克隆只支持object和array类型');   
    }
}
