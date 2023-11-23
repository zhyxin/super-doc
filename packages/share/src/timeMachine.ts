export const timeMachine = (target) => {
    new Proxy(target, {
        get: function (target, key) {
            console.log(`捕获到对象获取${String(key)}属性的值操作`);
            return target[key];
        },
        set: function (target, key, val): boolean {
            console.log(`捕获到对象设置${String(key)}属性的值操作,新值为${val}`);
            target[key] = val;
            return true;
        }
    });
}