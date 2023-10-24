import {isCustomObject} from "../../tools/helpers/objects";
import {generateRandomId} from "../../tools/helpers/random";

export type GeneralObjectType = Record<string, any>;

export type IsGeneralObjectType<T> = T extends GeneralObjectType ? true : false;
type SetValueArgument<T> = IsGeneralObjectType<T> extends true ? Partial<T> : T;

type SubscriberType<T> = (state: T, prevState: T) => void;

export interface IStateOptions {
    name?: string,
    doLogs?: boolean;
    persist?: boolean;
}

export const defaultNoriStateOptions: IStateOptions = {
    name: '',
    doLogs: false,
    persist: false,
}

export class NoriState<T extends GeneralObjectType> {
    private _subscribers = new Set<SubscriberType<T>>();
    private options: IStateOptions
    private _value: T;

    constructor (initialState: T, options?: IStateOptions) {
        if (!isCustomObject(initialState))
            throw new Error(`Your initialState is not an object`);

        this.options = { ...defaultNoriStateOptions, ...options || {} };
        this._value = initialState;

        if (this.options.persist && !this.options.name)
            throw new Error('You need to set the name of this state when enable persist')

        if (!this.options.name)
            this.options.name = generateRandomId(8);

        if (this.options.persist) {
            const persistedStorageValue = localStorage.getItem(this.persistedName)
            if (!persistedStorageValue) {
                this._value = initialState;
            } else {
                try {
                    this._value = JSON.parse(this.persistedName)
                } catch (error) {
                    console.error(error)

                    this._value = initialState;
                }
            }
        } else {
            this._value = initialState;
        }


        if (this.options.doLogs) {
            console.log(`Initial: "${this.options.name}"`, {[this.options.name]:this._value});
        }
    }

    public get name () {
        return this.options.name;
    }

    protected logState (current: T, prev: T): void {
        if (!this.options.doLogs) return;
        console.log(`Store: "${this.options.name}"`, { current, prev })
    }
     public get persistedName () {
        return `[NS]${this.options.name}`;
     }

    // === === === State === === ===
    public get value () {
        return this._value;
    }

    public set value (value: T) {
        if (this._subscribers.size >= 1) {
            this._subscribers.forEach((subscriber) => subscriber(value, this._value));
        }

        this.logState(value, this._value);

        this._value = value;
        if (this.options.persist) {
            try {
                localStorage.setItem(this.persistedName, JSON.stringify(this._value));
            } catch (error) {
                console.error(error);
            }
        }
    }

    public subscribe (subscriber: SubscriberType<T>) {
        this._subscribers.add(subscriber);

        return () => void this._subscribers.delete(subscriber);
    }

    public setValue (value: Partial<T> | T): T {
        const isStateAnObject = isCustomObject(this.value);
        const isValueAnObject = isCustomObject(value);

        try {
            if (isStateAnObject && isValueAnObject) {
                (this.value as GeneralObjectType) = {
                    ...this.value as GeneralObjectType,
                    ...value as GeneralObjectType
                };
            } else {
                console.warn('You need to set object values');
            }

            return this.value;
        } catch (err) {
            throw new Error(String(err))
        }
    }

    public async setAsyncValue (value: SetValueArgument<T>): Promise<T> {
        return Promise.resolve(this.setValue(value));
    }

    public setName (value: string) {
        this.options.name = value;
        return this;
    }

    public setDoLogs (value: boolean) {
        this.options.doLogs = value;
        return this;
    }

    public setPersist (value: boolean) {
        this.options.persist = value;
        return this;
    }
}
