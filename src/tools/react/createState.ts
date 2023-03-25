import {
    defaultNoriStoreOptions,
    GeneralObjectType,
    GeneralStoreType,
    IStateOptions,
    NoriState
} from "../../core/noriState";
import {
    createUseState,
    CreateUseStateHookType,
    defaultCreateUseStateOptions,
    ICreateUseStateOptions
} from "./createUseState";

export interface ICreateStateConfig {
    state?: IStateOptions,
    hook?: ICreateUseStateOptions
}

type CreateStateReturn<T extends GeneralStoreType | GeneralObjectType> = {
    state: NoriState<T>,
    hook: CreateUseStateHookType<T>;
};

export const createState = <T extends GeneralStoreType | GeneralObjectType>(initialState: T, options?: ICreateStateConfig): CreateStateReturn<T> => {
    const opts: ICreateStateConfig = {
        state: { ...defaultNoriStoreOptions, ...options && options?.state || {} },
        hook:  { ...defaultCreateUseStateOptions, ...options && options?.hook || {} }
    }

    const state = new NoriState(initialState, opts.state);

    return {
        state,
        hook: createUseState(state, opts.hook),
    }
};
