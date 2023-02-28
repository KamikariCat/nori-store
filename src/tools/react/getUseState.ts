import { GeneralStoreType, NoriStore } from '../../core/noriStore';
import { useEffect, useState } from 'react';

export const createUseState = <T extends GeneralStoreType>(store: NoriStore<T>, subscribe = true) => {
    return function <V extends keyof T>(...deps: V[]): Pick<T, V> {
        const [ state, setState ] = useState<Pick<T, V>>(store.state);

        useEffect(() => {
            if (subscribe) {
                return store.subscribe((state, prevState) => {
                    if (deps.length >= 1) {
                        let changedValues = {} as Pick<T, V>;
                        deps.forEach((keyName) => void (changedValues[ keyName ] = state[ keyName ]));

                        const hasChanges = deps.some((keyName) => state[ keyName ] !== prevState[ keyName ]);

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
};
