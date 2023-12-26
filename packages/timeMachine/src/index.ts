import { isObject, isArray } from "@super-doc/share";
import {
  ISnapshootUpdate,
  ISnapshootDelete,
  ISnapshootAdd,
  SNAPSHOOT_TYPE,
} from "./typing";
import { isArrayAttribute, isArrayDelete, isProxy } from "./utils";

interface Option {
  // specificKey: {
  //     deep: number;
  //     key: string;
  // },
  events: {
    add: Function;
    update: Function;
    delete: Function;
  };
}

export default class TimeMachine {
  public queue: (
    | ISnapshootUpdate
    | ISnapshootDelete
    | ISnapshootAdd
    | (ISnapshootUpdate | ISnapshootDelete | ISnapshootAdd)[]
  )[] = [];
  private proxys: any[] = [];

  private proxyMap: Map<Object, any> = new Map();
  public target = null;
  private option: Option = null;

  constructor(target: any, option?: Option) {
    if (!isObject(target) && !isArray(target)) {
      console.error("参数必须为数组或者对象");
      return;
    }
    this.option = option;
    this.target = this.createProxy(target, '');
    window["TimeMachine"] = this;
  }

  public get = (parentPath: string) => {
    return (target: any, key: string) => {
      // 是否被代理
      if (key === "IS_PROXY") {
        return true;
      }
      // 返回代理元对象parentKey
      if (key === "PROXY_TARGET") {
        return target;
      }
      if(key === "OBJECT_PATH") {
        return parentPath;
      }
      // 重构splice
      if (key === "splice" && typeof target[key] === "function") {
        return this._splice;
      }
      const value = target[key];
      if (target.hasOwnProperty(key) && (isObject(value) || isArray(value))) {
        const path = isObject(target) ? `.${key}` : `[${key}]`;
        return this.createProxy(value, `${parentPath}${path}`);
      } else if (
        typeof target[key] === "function" &&
        ["pop", "push", "shift", "unshift", "reverse", "sort"].includes(key)
      ) {
        const _that = this;
        return function (...args) {
          // 在拦截过程中直接模拟原地操作
          const pTarget = _that.proxyMap.get(target);

          switch (key) {
            case "pop":
              return pTarget.splice(target.length - 1, 1)[0];
            case "push":
              pTarget.splice(target.length, 0, ...args);
              return target.length;
            case "shift":
              return pTarget.splice(0, 1)[0];
            case "unshift":
              pTarget.splice(0, 0, ...args);
              return target.length;
            case "reverse":
              pTarget.splice(0, target.length, ...target.slice().reverse());
              return target;
            case "sort":
              pTarget.splice(0, target.length, ...target.slice().sort(...args));
              return target;
            default:
              break;
          }
        };
      } else {
        return value;
      }
    }
  };

  public set = (target, key: string, value: any): boolean => {
    const IS_PROXY = value?.IS_PROXY;
    // TODO: 排除数组的默认方法和已经代理过的方法
    if (IS_PROXY) {
      //   value = value.PROXY_TARGET;
      target[key] = value;
      return true;
    }
    const old = target[key];
    const HANDLER_TYPE =
      target.hasOwnProperty(key) === false
        ? "add"
        : old !== value
        ? "update"
        : null;
    if (HANDLER_TYPE === "add") {
      // 新增
      const snapshootAdd: ISnapshootAdd = {
        type: SNAPSHOOT_TYPE.ADD,
        new: value,
      };
      this.queue.push(snapshootAdd);
    } else if (HANDLER_TYPE === "update") {
      // 更新
      const snapshootUpdate: ISnapshootUpdate = {
        type: SNAPSHOOT_TYPE.UPDATE,
        old: old,
        new: value,
      };
      this.queue.push(snapshootUpdate);
    } else if (isArrayDelete(target, key)) {
      // 数组的删除
      const snapshootDelete: ISnapshootDelete = {
        type: SNAPSHOOT_TYPE.DELETE,
        old: target.slice(key),
      };
      this.queue.push(snapshootDelete);
    }
    target[key] = value;
    if (!IS_PROXY) {
      if (HANDLER_TYPE === SNAPSHOOT_TYPE.UPDATE) {
        this.option?.events?.[HANDLER_TYPE]?.(
          this.getState(target),
          key,
          this.getState(target)[key]
        );
      } else {
        this.option?.events?.[HANDLER_TYPE]?.(this.getState(target)[key]);
      }
    }
    return true;
  };

  public createProxy(target: any, parentPath: string) {
    let proxy = this.findProxy(target);
    if (!proxy) {
      proxy = new Proxy(target, {
        get: this.get(parentPath),
        set: this.set,
      });
    }
    this.proxyMap.set(target, proxy);
    return proxy;
  }

  public findProxy(target) {
    if (!this.proxyMap.has(target)) {
      return null;
    } else {
      return this.proxyMap.get(target);
    }
  }

  public getState(target) {
    if (!this.proxyMap.has(target)) {
      console.error(`${target.toString()}：不在队列中！`);
      return;
    } else {
      return this.proxyMap.get(target);
    }
  }

  // 重构数组的splice
  // 增删查改都在这里记录
  private _splice = function (start, deleteCount, ...items) {
    const callbackQueue = [];
    // 数组的删除
    if (deleteCount > 0) {
      /**
       * @description start + deleteCount === this.length
       * @description start 及后面的全删
       */
      if (start + deleteCount === this.length) {
        const snapshootDelete: ISnapshootDelete = {
          type: SNAPSHOOT_TYPE.DELETE,
          old: this.PROXY_TARGET.slice(start),
        };
        window["TimeMachine"].queue.push(snapshootDelete);
        callbackQueue.push(snapshootDelete);
      } else {
        const snapshootDelete: ISnapshootDelete = {
          type: SNAPSHOOT_TYPE.DELETE,
          old: this.PROXY_TARGET.slice(start, start + deleteCount),
        };
        window["TimeMachine"].queue.push(snapshootDelete);
        callbackQueue.push(snapshootDelete);
      }
    }

    // 新增
    if (items) {
      // 新增
      const snapshootAdd: ISnapshootAdd = {
        type: SNAPSHOOT_TYPE.ADD,
        new: items,
      };
      window["TimeMachine"].queue.push(snapshootAdd);
      callbackQueue.push(snapshootAdd);
    }

    const result = Array.prototype.splice.call(
      this.PROXY_TARGET,
      start,
      deleteCount,
      ...items
    );

    // 新增的需要proxy代理一下
    for (let i = 0; i < this.length; i++) this[i];

    callbackQueue.forEach((item) => {
      if (item.type === SNAPSHOOT_TYPE.DELETE) {
        const proxys = item.old.map((item) =>
          window["TimeMachine"].proxyMap.get(item)
        );

        window["TimeMachine"].option?.events?.delete?.(proxys);
      } else if (item.type === SNAPSHOOT_TYPE.ADD) {
        const proxys = item.new.map((item) =>
          window["TimeMachine"].proxyMap.get(item)
        );
        window["TimeMachine"].option?.events?.add?.(proxys);
      }
    });

    return result;
  };
}
