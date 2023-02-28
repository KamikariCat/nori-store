import { GeneralStoreType, Store } from '../../core/store';
export declare const createUseState: <T extends GeneralStoreType>(store: Store<T>, subscribe?: boolean) => <V extends keyof T>(...deps: V[]) => Pick<T, V>;
//# sourceMappingURL=getUseState.d.ts.map