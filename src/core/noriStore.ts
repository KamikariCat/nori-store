export type GeneralStoreType = Record<string, any>;

type SubscriberType<T> = (state: T, prevState: T) => void;

interface IStoreOptions {
    doLogs?: boolean;
}

const defaultOptions: IStoreOptions = {
    doLogs: true,
}

export class NoriStore<T extends GeneralStoreType> {
    private _subscribers = new Set<SubscriberType<T>>();
    private options: IStoreOptions
    private _state: T;
    private isSetValuesAsync: boolean
    public name: string;

    constructor (name: string, initialState: T, options?: IStoreOptions) {
        this.name = name;
        this._state = initialState;
        this.options = { ...defaultOptions, ...options || {} };

        this.isSetValuesAsync = false;

        if (this.options.doLogs) {
            console.log(`Initial: "${this.name}"`, {[this.name]:initialState});
        }
    }

    protected logState (current: T, prev: T): void {
        if (!this.options.doLogs) return;
        console.log(`Store: "${this.name}"`, { current, prev })
    }

    // === === === State === === ===
    public get state () {
        return this._state;
    }

    public set state (value: T) {
        if (this._subscribers.size >= 1) {
            this._subscribers.forEach((subscriber) => subscriber(value, this._state));
        }

        this.logState(value, this._state);

        this._state = value;
    }

    public subscribe (subscriber: SubscriberType<T>) {
        this._subscribers.add(subscriber);

        return () => void this._subscribers.delete(subscriber);
    }

    public setValues <V extends keyof T>(pieceOfState: Pick<T, V>): T {
        try {
            this.state = { ...this.state, ...pieceOfState };

            return this.state;
        } catch (err) {
            throw new Error(String(err))
        }
    }

    public async setValuesAsync <V extends keyof T>(pieceOfState: Pick<T, V>): Promise<T> {
        try {
            this.state = { ...this.state, ...pieceOfState };
            return this.state;
        } catch (err) {
            throw new Error(String(err));
        }
    }
}
