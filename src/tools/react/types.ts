import {GeneralObjectType, IStateOptions, NoriState} from "../../core/nori-state";

export interface ICreateUseStateOptions {
    subscribeOnHook?: boolean
}

export type UseStateDeps<T> = T extends GeneralObjectType ? (keyof T)[] : [];
export type UseStateHookArgsType<T> = UseStateDeps<T> | [null];

export type CreateUseStateHookType<T> = (...deps: UseStateHookArgsType<T>) => T;
export type ICreateStateConfig = IStateOptions & ICreateUseStateOptions;
export type CreateStateReturn<T extends GeneralObjectType> = [state: NoriState<T>, hook: CreateUseStateHookType<T>];
