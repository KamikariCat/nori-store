export type GeneralStoreType = Record<string, any>;
type SubscriberType<T> = (state: T, prevState: T) => void;
export declare class Store<T extends GeneralStoreType> {
    private _subscribers;
    private _state;
    name: string;
    constructor(name: string, initialState: T);
    get state(): T;
    set state(value: T);
    subscribe(subscriber: SubscriberType<T>): () => undefined;
    setValues<V extends keyof T>(pieceOfState: Pick<T, V>): T;
}
export {};
//# sourceMappingURL=store.d.ts.map