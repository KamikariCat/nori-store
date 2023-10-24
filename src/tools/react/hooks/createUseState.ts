import {GeneralObjectType, NoriState} from '../../../core/nori-state';
import {useEffect, useState} from 'react';
import {CreateUseStateHookType, ICreateUseStateOptions} from "../types";

export const defaultCreateUseStateOptions: ICreateUseStateOptions = {
    subscribeOnHook: true,
}

export const createUseState = <T extends GeneralObjectType>(store: NoriState<T>, options?: ICreateUseStateOptions) => {
    const opts: ICreateUseStateOptions = { ...defaultCreateUseStateOptions, ...(options || {}) };

    const hook: CreateUseStateHookType<T> = function (...deps) {
        const [ state, setState ] = useState<T>(store.value);

        useEffect(() => {
            if (opts.subscribeOnHook && deps[0] !== null) {
                return store.subscribe((storeState, prevStoreState) => {
                    if (deps && deps.length >= 1 && storeState !== null) {

                        // @ts-ignore
                        const uniqDeps = deps.filter((key, index) => deps.indexOf((key)) === index)
                        if (uniqDeps.length < deps.length)
                            console.warn(`You try to add duplicates into the createUseState deps in ${store.name} state`);

                        let changedValues = {} as Pick<T, keyof T>;

                        if (storeState)
                        {
                            uniqDeps.forEach((keyName: keyof T) => void (changedValues[ keyName ] = storeState[ keyName ]));
                            const hasChanges = uniqDeps.some((keyName: string) => storeState[ keyName ] !== prevStoreState[ keyName ]);

                            if (hasChanges) {
                                setState(changedValues);
                            } else {
                                return;
                            }
                        }
                    }
                    setState(storeState);
                });
            }

            return () => void 0;
        }, []);

        return state;
    };

    return hook;
};
