const ArrayAttribute = ['length'];
export function isProxy(target: any, proxyInstall): boolean {
    return Proxy.revocable(target, {}).proxy === proxyInstall;
}


export function isArrayAttribute(obj, key): boolean {
    return Array.isArray(obj) && ArrayAttribute.includes(key)
}

// 数组的删除操作
export function isArrayDelete(obj, key) {
    return Array.isArray(obj) && key === 'length';
}
