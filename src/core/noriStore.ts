export type GeneralStoreType = Record<string, any>;

type SubscriberType<T> = (state: T, prevState: T) => void;

export class NoriStore<T extends GeneralStoreType> {
    private _subscribers = new Set<SubscriberType<T>>();
    private _state: T;
    public name: string;

    constructor (name: string, initialState: T) {
        this.name = name;
        this._state = initialState;
    }

    // === === === State === === ===
    public get state () {
        return this._state;
    }

    public set state (value: T) {
        if (this._subscribers.size >= 1) {
            this._subscribers.forEach((subscriber) => subscriber(value, this._state));
        }
        this._state = value;
    }

    public subscribe (subscriber: SubscriberType<T>) {
        this._subscribers.add(subscriber);

        return () => void this._subscribers.delete(subscriber);
    }

    public setValues <V extends keyof T>(pieceOfState: Pick<T, V>) {
        this.state = { ...this.state, ...pieceOfState };

        return this.state;
    }
}
