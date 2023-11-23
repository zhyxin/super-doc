
export enum SNAPSHOOT_TYPE {
    UPDATE = 'update',
    DELETE = 'delete',
    ADD = 'add',
}

export interface ISnapshootBase {
    // path: string;
    // index: number;
    type: SNAPSHOOT_TYPE,
}

export type IOld = any;

export type INew = any;

export interface ISnapshootUpdate extends ISnapshootBase {
    type: SNAPSHOOT_TYPE.UPDATE,
    old: IOld,
    new: INew,
}

export interface ISnapshootDelete extends ISnapshootBase {
    type: SNAPSHOOT_TYPE.DELETE,
    old: IOld,
}

export interface ISnapshootAdd extends ISnapshootBase {
    type: SNAPSHOOT_TYPE.ADD,
    new: INew,
}
