import {GeneralObjectType, GeneralStoreType, NoriState} from '../../core/noriState';
import { useEffect, useState } from 'react';

export interface ICreateUseStateOptions {
    subscribe: boolean
}

export const defaultCreateUseStateOptions: ICreateUseStateOptions = {
    subscribe: true,
}

export type CreateUseStateHookType<T> = <K extends keyof T | T>(...deps: T extends GeneralObjectType ? (keyof T)[] : string[]) => T;

export const createUseState = <T extends GeneralStoreType | GeneralObjectType>(store: NoriState<T>, options?: ICreateUseStateOptions) => {
    const opts: ICreateUseStateOptions = { ...defaultCreateUseStateOptions, ...(options || {}) };

    const hook: CreateUseStateHookType<T> = function (...deps) {
        const [ state, setState ] = useState<T>(store.value);

        useEffect(() => {
            if (opts.subscribe) {
                return store.subscribe((state, prevState) => {
                    if (deps && deps.length >= 1 && state !== null) {

                        // @ts-ignore
                        const uniqDeps = deps.filter((key, index) => deps.indexOf((key)) === index)
                        if (uniqDeps.length < deps.length)
                            console.warn(`You try to add duplicates into the createUseState deps in ${store.name} state`);

                        let changedValues = {} as Pick<T, keyof T>;
                        // @ts-ignore state will be an object
                        uniqDeps.forEach((keyName: keyof T) => void (changedValues[ keyName ] = state[ keyName ]));

                        // @ts-ignore state and prevState will be objects
                        const hasChanges = uniqDeps.some((keyName) => state[ keyName ] !== prevState[ keyName ]);

                        if (hasChanges) {
                            setState(changedValues);
                        } else {
                            return;
                        }
                    }
                    setState(state);
                });
            }

            return () => void 0;
        }, []);

        return state;
    };

    return hook;
};
